"use node";

import {action} from "./_generated/server";
import {transcribeAudio} from "@/lib/ai/transcribe";
import {api} from "./_generated/api";
import {summarize} from "@/lib/ai/summarize";
import {v} from "convex/values";

// Action to handle Gemini text summarization (runs in Node.js environment)
export const summarizeText = action({
  args: {
    testimonialId: v.id("testimonials"),
    text: v.string(),
  },
  handler: async (ctx, {testimonialId, text}) => {
    console.log("Starting text summarization using OpenAI with Groq");
    try {
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        {id: testimonialId},
      );
      if (testimonial) {
        const resp = await summarize(text, testimonial.name);
        await ctx.runMutation(api.testimonials.updateSummaryAndTitle, {
          id: testimonialId,
          summary: resp.summary,
          title: resp.title,
        });
        console.log(`Summarization completed for testimonial ${testimonialId}`);
      } else {
        throw new Error("Testimonial not found");
      }
    } catch (error) {
      console.error(
        `Summarization failed for testimonial ${testimonialId}: ${error}`,
      );
      return;
    }
  },
});

export const transcribe = action({
  args: {
    testimonialId: v.id("testimonials"),
    mediaUrl: v.string(),
  },
  handler: async (ctx, {testimonialId, mediaUrl}) => {
    try {
      const transcribedText = await transcribeAudio(mediaUrl);

      if (!transcribedText) {
        console.error(
          `Transcription returned no text for testimonial ${testimonialId}`,
        );
        return;
      }

      // Update the testimonial with the transcribed text
      await ctx.runMutation(api.testimonials.updateTranscription, {
        id: testimonialId,
        text: transcribedText,
      });

      console.log(
        `Transcription completed and summarization scheduled for testimonial ${testimonialId}`,
      );
    } catch (error) {
      console.error(
        `Transcription failed for testimonial ${testimonialId}: ${error}`,
      );
      return;
    }
  },
});