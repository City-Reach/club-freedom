import mimeType from "mime-types";
import OpenAI from "openai";

// https://platform.openai.com/docs/guides/speech-to-text
const SUPPORT_FORMATS = ["mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm"];

export async function transcribeAudio(upload_url: string) {
  const response = await fetch(upload_url);
  const blob = await response.blob();

  const mimetype = blob.type;
  const extension =
    SUPPORT_FORMATS.find((ext) => ext === mimeType.extension(mimetype)) ||
    "webm";

  const audioFile = new File([blob], `audio.${extension}`, {
    type: mimetype,
  });

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: `${process.env.AI_GATEWAY_ENDPOINT}/groq`,
    defaultHeaders: {
      "cf-aig-authorization": `Bearer ${process.env.AI_GATEWAY_API_TOKEN}`,
    },
  });

  const transcription = await client.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-large-v3",
  });

  console.log("transcript", transcription.text);

  return transcription.text;
}
