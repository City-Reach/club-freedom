import axios from "axios";
import OpenAI from "openai";
import Groq from "groq-sdk";

export async function transcribeAudio(upload_url: string): Promise<string> {
    let buffer: Buffer;
    try {
        const readStream = await axios.get(upload_url, {
            responseType: "arraybuffer",
        });
        buffer = Buffer.from(readStream.data);

        // @ts-ignore
        const audioFile = new File([buffer as Uint8Array], "audio.mp3", {
            type: "audio/mpeg"
        });

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-large-v3",
            prompt: "Specify context or spelling", // Optional
            response_format: "verbose_json", // Optional
            timestamp_granularities: ["word", "segment"], // Optional
            language: "en", // Optional
            temperature: 0.0, // Optional
        });

        // const client = new OpenAI({
        //     apiKey: process.env.GROQ_API_KEY,
        //     baseURL: "https://api.groq.com/openai/v1"
        // });
        //
        // const transcription = await client.audio.transcriptions.create({
        //     file: file,
        //     model: "whisper-large-v3",
        // });

        console.log("transcript", transcription.text);

        return transcription.text
    } catch (error) {
        console.error(error);
        throw new Error("Transcription did not complete within the expected time.");
    }
}
