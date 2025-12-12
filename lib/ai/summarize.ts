import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";

const SummaryResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
});

type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

export async function summarize(input: string, name: string) {
  const aiClient = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: `${process.env.AI_GATEWAY_ENDPOINT}/compat`,
    defaultHeaders: {
      "cf-aig-authorization": `Bearer ${process.env.AI_GATEWAY_API_TOKEN}`,
    },
  });

  try {
    const completion = await aiClient.chat.completions.create({
      model: "google-ai-studio/gemini-2.5-flash",
      reasoning_effort: "none",

      messages: [
        {
          role: "system",
          content: `You are an AI Assistant tasked with summarizing testimonials from volunteers who are sharing their
        experiences about working with the less fortunate. Summarize their testimonials within one paragraph and generate a title.
        You will get text as input. There is no need to include sources. Include the volunteer's name in the summary.`,
        },
        {
          role: "user",
          content: `The name of the volunteer is ${name}. ${input}`,
        },
      ],
      response_format: zodResponseFormat(
        SummaryResponseSchema,
        "summary_response",
      ),
    });

    const responseContent = completion.choices[0].message.content;

    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    return JSON.parse(responseContent) as SummaryResponse;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
}
