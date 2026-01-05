import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { logger, task } from "@trigger.dev/sdk";
import { ConvexHttpClient } from "convex/browser";
import type { FunctionArgs } from "convex/server";
import ffmpeg from "fluent-ffmpeg";
import OpenAI from "openai";
import { PostHog } from "posthog-node";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { env } from "@/env/trigger";
import {
  ffmpegProcessMediaTriggerId,
  tempTestimonialFolder,
} from "@/lib/constants";

const convexHttpClient = new ConvexHttpClient(env.CONVEX_URL);

const s3Client = new S3Client({
  // How to authenticate to R2: https://developers.cloudflare.com/r2/api/s3/tokens/
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const postHogClient = new PostHog(env.POSTHOG_API_KEY, {
  host: env.POSTHOG_HOST,
});

const transcribeClient = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: `${env.AI_GATEWAY_ENDPOINT}/groq`,
  defaultHeaders: {
    "cf-aig-authorization": `Bearer ${process.env.AI_GATEWAY_API_TOKEN}`,
  },
});

function afterLastSlash(str: string): string {
  const index = str.lastIndexOf("/");
  return index !== -1 ? str.slice(index + 1) : str;
}

export async function transcribeAudio(media_path: string) {
  const transcription = await transcribeClient.audio.transcriptions.create({
    file: fs.createReadStream(media_path),
    model: "whisper-large-v3",
  });
  return transcription.text;
}
const ffmpegCompressionOptions = [
  "-preset veryslow", // Slowest preset for best compression
  "-b:a 64k", // Reduce audio bitrate to 64k
  "-ac 1", // Convert to mono audio
];
const ffmpegAudioCompressionptions = [
  ...ffmpegCompressionOptions,
  "-ar 16000", // Set audio sample rate to 16kHz
];
async function ffmpegCompressAudio(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(ffmpegAudioCompressionptions)
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
async function ffmpegCompressVideo(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([...ffmpegCompressionOptions, "-crf 28"])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

async function extractAudio(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-vn", // Disable video output
        "-ar 16000", // Set audio sample rate to 44.1 kHz
        "-ac 1", // Set audio channels to stereo
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
export const ffmpegProcessMedia = task({
  id: ffmpegProcessMediaTriggerId,
  run: async (payload: {
    testimonialId: Id<"testimonials">;
    mediaKey: string;
  }) => {
    const { mediaKey, testimonialId } = payload;
    //Generate file names
    const tempDirectory = os.tmpdir();
    const isMediaTemp = mediaKey.startsWith(tempTestimonialFolder);
    const edittedMediaKey = isMediaTemp
      ? mediaKey.slice(tempTestimonialFolder.length)
      : mediaKey;
    let inputPath = path.join(tempDirectory, `input_${edittedMediaKey}`);
    let compressionOutputPath = path.join(
      tempDirectory,
      `compressed_${edittedMediaKey}`,
    );
    let audioExtractionOutputPath = path.join(
      tempDirectory,
      `extracted_audio_${edittedMediaKey}`,
    );

    const convexMutationArgs: FunctionArgs<
      typeof api.testimonials.updateTestimonial
    > = {
      _id: testimonialId,
    };
    try {
      //Retrieve file from r2 and save it locally
      const { Body, ContentType } = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: mediaKey,
        }),
      );
      if (!Body) {
        throw new Error("Failed to fetch media");
      }
      const isAudio = Boolean(ContentType?.startsWith("audio/"));
      const isVideo = Boolean(ContentType?.startsWith("video/"));
      const extFromMime = ContentType ? afterLastSlash(ContentType) : "webm";
      inputPath = `${inputPath}.${extFromMime}`;
      compressionOutputPath = `${compressionOutputPath}.${extFromMime}`;
      audioExtractionOutputPath = `${audioExtractionOutputPath}.${extFromMime}`;
      const writeStream = fs
        .createWriteStream(inputPath)
        .on("error", (err) => logger.error(err.message));
      writeStream.write(await Body.transformToByteArray());

      //only compress if file from r2 is a temp file
      if (isMediaTemp) {
        if (isVideo) {
          await ffmpegCompressVideo(inputPath, compressionOutputPath);
        }
        if (isAudio) {
          await ffmpegCompressAudio(inputPath, compressionOutputPath);
        }
        const compressedMedia = await fsPromises.readFile(
          compressionOutputPath,
        );
        const r2Key = path.basename(compressionOutputPath);
        const uploadParams = {
          Bucket: process.env.R2_BUCKET,
          Key: r2Key,
          Body: compressedMedia,
          ContentType: ContentType,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        convexMutationArgs.storageId = r2Key;
      }

      let transcribePath = isMediaTemp ? compressionOutputPath : inputPath;
      if (isVideo) {
        await extractAudio(transcribePath, audioExtractionOutputPath);
        transcribePath = audioExtractionOutputPath;
      }

      const transcribedText = await transcribeAudio(transcribePath);
      convexMutationArgs.testimonialText = transcribedText;

      await convexHttpClient
        .mutation(api.testimonials.updateTestimonial, convexMutationArgs)
        .catch((err) => {
          logger.error(err.message);
          throw new Error(err.message);
        });
      if (isMediaTemp) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: mediaKey,
          }),
        );
      }
    } catch (err) {
      logger.error(
        `Error while compressing media: ${(err as any)?.message ?? err}`,
      );
      await convexHttpClient.mutation(api.testimonials.updateTestimonial, {
        _id: testimonialId,
        processingStatus: "error",
      });
      postHogClient.captureException(err, `media-process-${testimonialId}`, {
        testimonialId: testimonialId,
        mediaKey: mediaKey,
      });
    } finally {
      // Delete temporary files and the original object in parallel
      const deleteOutputPromise = fsPromises
        .unlink(compressionOutputPath)
        .catch((err) => logger.error(err.message));

      const deleteInputPromise = fsPromises
        .unlink(inputPath)
        .catch((err) => logger.error(err.message));

      const deleteExtractedAudioPromise = fsPromises
        .unlink(audioExtractionOutputPath)
        .catch((err) => logger.error(err.message));

      await Promise.all([
        deleteInputPromise,
        deleteOutputPromise,
        deleteExtractedAudioPromise,
      ]);
    }
    return;
  },
});
