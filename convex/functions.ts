/* eslint-disable no-restricted-imports */

import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { api } from "./_generated/api";
/* eslint-enable no-restricted-imports */
import type { DataModel } from "./_generated/dataModel";
import {
  internalMutation as rawInternalMutation,
  mutation as rawMutation,
} from "./_generated/server";
import { r2 } from "./r2";

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
});

// Only trigger when storageId changes
triggers.register("testimonials", async (ctx, change) => {
  const oldStorageId = change.oldDoc?.storageId;
  const storageId = change.newDoc?.storageId;

  if (oldStorageId === storageId || storageId?.startsWith("temp/")) {
    return;
  }
  console.log("oldStorageId: ", oldStorageId);
  console.log("storageId: ", storageId);
  if (!storageId) {
    console.log(
      `New testimonial inserted with id ${change.id} but no media ID.`,
    );
    return;
  }

  const id = change.id;
  const mediaUrl = await r2.getUrl(storageId);

  if (!mediaUrl) {
    console.log(
      `New testimonial inserted with id ${id} but failed to get media URL for storage ID ${storageId}.`,
    );
    return;
  }
  //todo trigger the compression task and move transcribe logic to trigger.dev
  // await ctx.scheduler.runAfter(0, api.triggerTask.triggerMediaProcessing, {
  //   testimonialId: id,
  //   mediaUrl,
  // });
  // Schedule transcription as an action (runs in Node.js environment)
  await ctx.scheduler.runAfter(0, api.ai.transcribe, {
    testimonialId: id,
    mediaUrl,
  });
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
  await ctx.scheduler.runAfter(0, api.ai.summarizeText, {
    testimonialId: id,
    text: newText,
  });
});

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
