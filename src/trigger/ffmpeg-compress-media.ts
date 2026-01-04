import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { logger, task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import fsPromises from "fs/promises";
import os from "os";
import path from "path";
import OpenAI from "openai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";


const convexHttpClient = new ConvexHttpClient(process.env.CONVEX_URL || "");

const s3Client = new S3Client({
  // How to authenticate to R2: https://developers.cloudflare.com/r2/api/s3/tokens/
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const transcribeClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: `${process.env.AI_GATEWAY_ENDPOINT}/groq`,
  defaultHeaders: {
    "cf-aig-authorization": `Bearer ${process.env.AI_GATEWAY_API_TOKEN}`,
  },
});

function afterLastSlash(str: string): string {
  const index = str.lastIndexOf('/');
  return index !== -1 ? str.slice(index + 1) : str;
}

export async function transcribeAudio(media_path: string) {
  const transcription = await transcribeClient.audio.transcriptions.create({
    file: fs.createReadStream(media_path),
    model: "whisper-large-v3",
  });
  logger.log("triggered transcription from transcribeAudio")
  return transcription.text;
}

async function ffmpegCompressAudio(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-preset veryslow", // Slowest preset for best compression
        "-b:a 64k", // Reduce audio bitrate to 64k
        "-ar 16000", // Set audio sample rate to 16kHz
        "-ac 1", // Convert to mono audio
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
async function ffmpegCompressVideo(inputPath: string, outputPath: string) {
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-crf 28", // Higher CRF for more compression (28 is near the upper limit for acceptable quality)
        "-preset veryslow", // Slowest preset for best compression
        "-b:a 64k", // Reduce audio bitrate to 64k
        "-ac 1", // Convert to mono audio
      ])
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
export const ffmpegCompressMedia = task({
  id: "ffmpeg-compress-media",
  run: async (payload: { testimonialId: string; mediaKey: string }) => {
    const { mediaKey, testimonialId } = payload;
    //Generate file names
    const tempDirectory = os.tmpdir();
    const edittedMediaKey = mediaKey.startsWith("temp/")
      ? mediaKey.slice("temp/".length)
      : mediaKey;
    let inputPath = path.join(tempDirectory, `input_${edittedMediaKey}`);
    let outputPath = path.join(tempDirectory, `compressed_${edittedMediaKey}`);
    try {

      const { Body, ContentType } = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: mediaKey,
        }),
      );
      if (!Body) {
        throw new Error("Failed to fetch media");
      }
      const isAudio = Boolean(ContentType && ContentType.startsWith("audio/"));
      const isVideo = Boolean(ContentType && ContentType.startsWith("video/"));
      const extFromMime = ContentType ? afterLastSlash(ContentType) : "webm";
      inputPath = `${inputPath}.${extFromMime}`;
      outputPath = `${outputPath}.${extFromMime}`;
      const writeStream = fs
        .createWriteStream(inputPath)
        .on("error", (err) => logger.error(err.message));
      writeStream.write(await Body.transformToByteArray());
      if (isVideo) {
        await ffmpegCompressVideo(inputPath, outputPath);
      }
      if (isAudio) {
        await ffmpegCompressAudio(inputPath, outputPath);
      }

      const compressedMedia = await fsPromises.readFile(outputPath);
      const r2Key = path.basename(outputPath);
      const uploadParams = {
        Bucket: process.env.R2_BUCKET,
        Key: r2Key,
        Body: compressedMedia,
        ContentType: ContentType,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));

      // Notify Convex HTTP action to update a testimonial for this uploaded media
      await convexHttpClient.mutation(api.testimonials.updateTestimonial, {
        _id: testimonialId as Id<"testimonials">,
        storageId: r2Key,
      }).catch((err) => {
        logger.error(err.message)
        throw new Error(err.message);
      });

      // const transcribedText = await transcribeAudio(outputPath);

      //http for updating testimonial text and processing status

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: mediaKey,
      }));
      
    } catch (err) {
      logger.error(`Error while compressing media: ${(err as any)?.message ?? err}`);
      console.error(`Error while compressing media: ${(err as any)?.message ?? err}`);
    } finally {
      // Delete temporary files and the original object in parallel
      const deleteOutputPromise = fsPromises.unlink(outputPath).catch((err) =>
        logger.error(`Failed to delete temporary compressed video file`, {
          outputPath,
          error: err?.message ?? err,
        }),
      );

      const deleteInputPromise = fsPromises.unlink(inputPath).catch((err) =>
        logger.error(`Failed to delete temporary input video file`, {
          inputPath,
          error: err?.message ?? err,
        }),
      );

      await Promise.all([
        deleteOutputPromise,
        deleteInputPromise,
      ]);
    }
    return
  },
});
