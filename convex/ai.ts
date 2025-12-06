"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { transcribeAudio } from "@/lib/ai/transcribe";
import { api } from "./_generated/api";

export const transcribe = action({
  args: {
    testimonialId: v.id("testimonials"),
    mediaUrl: v.string(),
  },
  handler: async (ctx, { testimonialId, mediaUrl }) => {
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

      // Schedule summarization as an action (runs in Node.js environment)
      await ctx.scheduler.runAfter(0, api.functions.summarizeText, {
        testimonialId: testimonialId,
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