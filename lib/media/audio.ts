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

export const compressAudio = async (file: File) => {
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
    audio: {
      sampleRate: 16000,
      codec: "opus",
      forceTranscode: true,
      numberOfChannels: 1,
      bitrate: QUALITY_MEDIUM,
    },
  });

  await conversion.execute();

  if (!output.target.buffer) {
    throw new Error("Failed to compress video file");
  }

  const blob = new Blob([output.target.buffer], {
    type: "audio/mp4",
  });

  const outputFile = new File(
    [blob],
    `${file.name}-compress.${output.format.fileExtension}`,
    {
      type: blob.type,
    },
  );

  return outputFile;
};
