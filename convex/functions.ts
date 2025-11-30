/* eslint-disable no-restricted-imports */
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation,
  action,
} from "./_generated/server";
/* eslint-enable no-restricted-imports */
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { GeminiResponse, summarize_text } from "@/gemini/summarize_text";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { transcribeAudio } from "@/lib/transcribe";
import { r2 } from "./r2";
import { summarize } from "@/lib/ai/summarize";

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>();

triggers.register("testimonials", async (ctx, change) => {
  const oldEmail = change.oldDoc?.email;
  const email = change.newDoc?.email;
  const oldName = change.oldDoc?.name;
  const name = change.newDoc?.name;
  const oldSummary = change.oldDoc?.summary;
  const summary = change.newDoc?.summary;
  const oldText = change.oldDoc?.testimonialText;
  const text = change.newDoc?.testimonialText;
  const oldTitle = change.oldDoc?.title;
  const title = change.newDoc?.title;

  if (
    oldEmail === email &&
    oldName === name &&
    oldSummary === summary &&
    oldText === text &&
    oldTitle === title
  ) {
    return;
  }
  const newSearchText = [email, name, summary, text, title].join(" ");
  await ctx.db.patch(change.id, { searchText: newSearchText });

  console.log(`updated testimonial searchText for testimonial ${change.id}`);
});

// Only trigger when media_id changes
triggers.register("testimonials", async (ctx, change) => {
  const oldMediaId = change.oldDoc?.storageId;
  const mediaId = change.newDoc?.storageId;

  if (oldMediaId === mediaId) {
    return;
  }

  if (!mediaId) {
    console.log(
      `New testimonial inserted with id ${change.id} but no media ID.`
    );
    return;
  }

  const id = change.id;
  const mediaUrl = await r2.getUrl(mediaId);

  if (!mediaUrl) {
    console.log(
      `New testimonial inserted with id ${id} but failed to get media URL for storage ID ${mediaId}.`
    );
    return;
  }

  // Schedule transcription as an action (runs in Node.js environment)
  await ctx.scheduler.runAfter(0, api.functions.transcribe, {
    testimonialId: id,
    mediaUrl,
  });

  console.log(`Scheduled transcription for testimonial ${id}`);
});

// Trigger when the transcript changes
triggers.register("testimonials", async (ctx, change) => {
  const oldText = change.oldDoc?.testimonialText;
  const newText = change.newDoc?.testimonialText;

  if (oldText === newText) {
    return;
  }
  if (!newText) {
    return;
  }

  const id = change.id;

  // Schedule summarization as an action (runs in Node.js environment)
  await ctx.scheduler.runAfter(0, api.functions.summarizeText, {
    testimonialId: id,
    text: newText,
  });

  console.log(`Scheduled summarization for testimonial ${id}`);
});

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB)
);

// Action to handle AssemblyAI transcription (runs in Node.js environment)
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
          `Transcription returned no text for testimonial ${testimonialId}`
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
        `Transcription completed and summarization scheduled for testimonial ${testimonialId}`
      );
    } catch (error) {
      console.error(
        `Transcription failed for testimonial ${testimonialId}: ${error}`
      );
      return;
    }
  },
});

// Action to handle Gemini text summarization (runs in Node.js environment)
export const summarizeText = action({
  args: {
    testimonialId: v.id("testimonials"),
    text: v.string(),
  },
  handler: async (ctx, { testimonialId, text }) => {
    console.log("Starting text summarization using Gemini API");
    try {
      const testimonial = await ctx.runQuery(
        api.testimonials.getTestimonialById,
        { id: testimonialId }
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
        `Summarization failed for testimonial ${testimonialId}: ${error}`
      );
      return;
    }
  },
});
