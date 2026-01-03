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
import mime from "mime-types";
import os from "os";
import path from "path";

const s3Client = new S3Client({
  // How to authenticate to R2: https://developers.cloudflare.com/r2/api/s3/tokens/
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

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
    const extFromMime = ContentType ? mime.extension(ContentType) : "webm";
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
    try {
      const convexDeployment = process.env.CONVEX_DEPLOYMENT_NAME;
      const convexBaseUrl = convexDeployment
        ? `https://${convexDeployment}.convex.site`
        : undefined;

      if (!convexBaseUrl) {
        logger.error(
          "CONVEX deployment name not set; skipping PUT to Convex HTTP action",
        );
      } else {
        const updatePayload = {
          testimonialId: testimonialId,
          storageId: r2Key,
        } as const;
        const res = await fetch(`${convexBaseUrl}/putTestimonialHttpAction`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
        } else {
          const text = await res.text().catch(() => "<no body>");
          logger.error("Failed to PUT to Convex HTTP action", {
            status: res.status,
            body: text,
            url: `${convexBaseUrl}/putTestimonialHttpAction`,
          });
        }
      }
    } catch (err) {
      logger.error("Error while calling Convex HTTP action", {
        error: (err as any)?.message ?? err,
      });
    }

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

    const deleteR2Promise = s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: mediaKey,
      }),
    );

    await Promise.all([
      deleteOutputPromise,
      deleteInputPromise,
      deleteR2Promise,
    ]);

    // Return the compressed video buffer and r2 key
    return {
      r2Key,
    };
  },
});
