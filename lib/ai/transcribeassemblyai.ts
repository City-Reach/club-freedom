import axios from "axios";
import OpenAI from "openai";

export async function transcribeAudio(upload_url: string): Promise<string> {
    const API_KEY = process.env.ASSEMBLYAI_API_KEY;

  //request the transcription
  const transcript_result = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    { audio_url: upload_url },
    {
      headers: {
        authorization: API_KEY,
        "content-type": "application/json",
      },
    },
  );

  const transcriptId = transcript_result.data.id;

  // poll
  let attempts = 0;
  const maxAttempts = 60;

  while (attempts < maxAttempts) {
    const poll_result = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: API_KEY } },
    );

    const status = poll_result.data.status;

    //return transcripted text as string
    if (status === "completed") {
      return poll_result.data.text as string;
    }

    //if error occurs, throw error
    else if (status === "error") {
      throw new Error("Transcription failed: " + poll_result.data.error);
    }

    //wait before polling again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }
  throw new Error("Transcription did not complete within the expected time.");
}
