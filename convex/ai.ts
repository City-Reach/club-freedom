"use node";

import { v } from "convex/values";
import { summarize } from "@/lib/ai/summarize";
import { transcribeAudio } from "@/lib/ai/transcribe";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

// Action to handle Gemini text summarization (runs in Node.js environment)
export const summarizeText = action({
  args: {
    testimonialId: v.id("testimonials"),
    text: v.string(),
  },
<<<<<<< HEAD
  handler: async (ctx, {testimonialId, text}) => {
=======
  handler: async (ctx, { testimonialId, text }) => {
    console.log("Starting text summarization using OpenAI with Groq");
>>>>>>> 8be3a2f (Apply formatter)
    try {
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        { id: testimonialId },
      );
      if (testimonial) {
        const resp = await summarize(text, testimonial.name);
        await ctx.runMutation(api.testimonials.updateSummaryAndTitle, {
          id: testimonialId,
          summary: resp.summary,
          title: resp.title,
        });
      } else {
        throw new Error("Testimonial not found");
      }
    } catch (error) {
      postHogClient.captureException(error, `summarizeText-${testimonialId}`, { testimonialId: testimonialId, text: text });
      return;
    }
  },
});

export const transcribe = action({
  args: {
    testimonialId: v.id("testimonials"),
    mediaUrl: v.string(),
  },
  handler: async (ctx, { testimonialId, mediaUrl }) => {
    try {
      const transcribedText = await transcribeAudio(mediaUrl);
      if (!transcribedText) {
        throw new Error(`Transcription returned no text for testimonial ${testimonialId}`);
      }

      // Update the testimonial with the transcribed text
      await ctx.runMutation(api.testimonials.updateTranscription, {
        id: testimonialId,
        text: transcribedText,
      });
    } catch (error) {
      postHogClient.captureException(error, `transcribe-${testimonialId}`, { testimonialId: testimonialId, mediaUrl: mediaUrl });
      return;
    }
  },
});
