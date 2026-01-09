import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import z from "zod";

const SummaryResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
});

type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

export async function summarize(input: string, name: string | undefined) {
  const user_content = name
    ? `The name of the testimonial giver is ${name}. ${input}`
    : input;

  const aiClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: `${process.env.AI_GATEWAY_ENDPOINT}/groq`,
    defaultHeaders: {
      "cf-aig-authorization": `Bearer ${process.env.AI_GATEWAY_API_TOKEN}`,
    },
  });

  try {
    const completion = await aiClient.chat.completions.create({
      model: "openai/gpt-oss-120b",
      reasoning_effort: "medium",

      messages: [
        {
          role: "system",
          content: `You are an AI Assistant tasked with summarizing testimonials. Ensure the summary is shorter than the testimonial and generate a title.
            You will get text as input. There is no need to include sources. If the testimonial giver's name is mentioned, include 
            it in the summary.`,
        },
        {
          role: "user",
          content: user_content,
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
