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

export const ffmpegCompressVideo = task({
  id: "ffmpeg-compress-video",
  run: async (payload: { testimonialId: string; mediaKey: string }) => {
    const { mediaKey, testimonialId } = payload;

    // Generate temporary file names
    const tempDirectory = os.tmpdir();
    const edittedMediaKey = mediaKey.startsWith("temp/")
      ? mediaKey.slice("temp/".length)
      : mediaKey;
    let inputPath = path.join(tempDirectory, `input_${edittedMediaKey}`);
    let outputPath = path.join(tempDirectory, `compressed_${edittedMediaKey}`);

    // Fetch the video and download it to temporary file
    const { Body, ContentType, ContentEncoding } = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: mediaKey,
      }),
    );
    if (!Body) {
      throw new Error("Failed to fetch video");
    }
    const extFromMime = ContentType ? mime.extension(ContentType) : "mp4";
    inputPath = `${inputPath}.${extFromMime}`;
    outputPath = `${outputPath}.${extFromMime}`;
    const writeStream = fs
      .createWriteStream(inputPath)
      .on("error", (err) => logger.error(err.message));
    writeStream.write(
      await Body.transformToByteArray(),
    );

    // Compress the video
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          // "-c:v libx264", // Use H.264 codec for mp4
          "-crf 28", // Higher CRF for more compression (28 is near the upper limit for acceptable quality)
          "-preset veryslow", // Slowest preset for best compression
          //   "-vf scale=iw/2:ih/2", // Reduce resolution to 320p width (height auto-calculated)
          // "-c:a aac", // Use AAC for audio for mp4
          "-b:a 64k", // Reduce audio bitrate to 64k
          "-ac 1", // Convert to mono audio
        ])
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    //todo compress audio if media is audio

    // Read the compressed video
    const compressedVideo = await fsPromises.readFile(outputPath);

    // Create the r2Key for the extracted audio, using the base name of the output path
    const r2Key = path.basename(outputPath);

    const uploadParams = {
      Bucket: process.env.R2_BUCKET,
      Key: r2Key,
      Body: compressedVideo,
      ContentType: ContentType,
    };

    // Upload the video to R2 and get the URL
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
    const deleteOutputPromise = fsPromises
      .unlink(outputPath)
      .catch((err) =>
        logger.error(`Failed to delete temporary compressed video file`, {
          outputPath,
          error: err?.message ?? err,
        }),
      );

    const deleteInputPromise = fsPromises
      .unlink(inputPath)
      .catch((err) =>
        logger.error(`Failed to delete temporary input video file`, {
          inputPath,
          error: err?.message ?? err,
        }),
      );

    const deleteR2Promise = s3Client
      .send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: mediaKey,
        }),
      )
      .then(({ DeleteMarker }) => {
        if (DeleteMarker) {
        } else {
          logger.error(`Failed to delete temporary original video file in R2`, {
            mediaKey,
          });
        }
      })
      .catch((err) =>
        logger.error(`Failed to delete temporary original video file in R2`, {
          mediaKey,
          error: err?.message ?? err,
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
