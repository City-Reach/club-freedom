export type MediaConfig = {
  type: string;
  mimeType: string;
};

const POSSIBLE_VIDEO_CONFIGS = [
  {
    type: "video/mp4",
    mimeType: "video/mp4; codecs=h.264",
  },
  {
    type: "video/webm",
    mimeType: "video/webm; codecs=vp9",
  },
  {
    type: "video/webm",
    mimeType: "video/webm",
  },
] satisfies MediaConfig[];

export const getVideoConfig = () => {
  return POSSIBLE_VIDEO_CONFIGS.find((config) =>
    MediaRecorder.isTypeSupported(config.mimeType),
  );
};

export const VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS = 120;
export const AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS = 300;
