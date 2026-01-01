import {
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

// Initialize S3 client
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
  run: async (payload: { mediaKey: string }) => {
    const { mediaKey } = payload;

    // Generate temporary file names
    const tempDirectory = os.tmpdir();
    let inputPath = path.join(tempDirectory, `input_${Date.now()}_${mediaKey}`);
    let outputPath = path.join(
      tempDirectory,
      `output_${Date.now()}_${mediaKey}`,
    );

    // Fetch the video
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
    writeStream.write(await Body.transformToByteArray());
    logger.log("Downloaded video saved to temporary path", { inputPath });

    // Compress the video
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-c:v libx264", // Use H.264 codec
          "-crf 28", // Higher CRF for more compression (28 is near the upper limit for acceptable quality)
          "-preset veryslow", // Slowest preset for best compression
          //   "-vf scale=iw/2:ih/2", // Reduce resolution to 320p width (height auto-calculated)
          "-c:a aac", // Use AAC for audio
          "-b:a 64k", // Reduce audio bitrate to 64k
          "-ac 1", // Convert to mono audio
        ])
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Read the compressed video
    const compressedVideo = await fsPromises.readFile(outputPath);
    const compressedSize = compressedVideo.length;

    // Log compression results
    logger.log(`Compressed video size: ${compressedSize} bytes`);
    logger.log(`Temporary compressed video file created`, { outputPath });

    // Create the r2Key for the extracted audio, using the base name of the output path
    const r2Key = `processed-videos/${path.basename(outputPath)}`;

    const uploadParams = {
      Bucket: process.env.R2_BUCKET,
      Key: r2Key,
      Body: compressedVideo,
    };

    // Upload the video to R2 and get the URL
    await s3Client.send(new PutObjectCommand(uploadParams));
    logger.log(`Compressed video saved to your r2 bucket`, { r2Key });

    // Delete the temporary compressed video file
    await fsPromises.unlink(outputPath);
    logger.log(`Temporary compressed video file deleted`, { outputPath });

    // Return the compressed video buffer and r2 key
    return {
      Bucket: process.env.R2_BUCKET,
      r2Key,
    };
  },
});
