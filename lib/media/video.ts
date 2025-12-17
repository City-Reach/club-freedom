import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  Input,
  Mp4OutputFormat,
  Output,
  QUALITY_MEDIUM,
} from "mediabunny";

export const compressVideo = async (file: File) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  });

  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  });

  const conversion = await Conversion.init({
    input,
    output,
    video: {
      frameRate: 24,
      codec: "vp9",
      bitrate: QUALITY_MEDIUM,
      forceTranscode: true,
    },
    audio: {
      bitrate: QUALITY_MEDIUM,
      codec: "opus",
      sampleRate: 16000,
      forceTranscode: true,
    },
  });

  await conversion.execute();

  if (!output.target.buffer) {
    throw new Error("Failed to compress video file");
  }

  const blob = new Blob([output.target.buffer], {
    type: output.format.mimeType,
  });

  const outputFile = new File(
    [blob],
    `${file.name}-compress.${output.format.fileExtension}`,
    {
      type: output.format.mimeType,
    },
  );

  return outputFile;
};
