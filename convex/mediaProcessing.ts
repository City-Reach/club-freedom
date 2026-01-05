"use node";

import { v } from "convex/values";
import { ffmpegProcessMediaTriggerId } from "@/lib/constants";
import { action } from "./_generated/server";

export const processMedia = action({
  args: {
    testimonialId: v.id("testimonials"),
    mediaKey: v.string(),
  },
  handler: async (ctx, args) => {
    await fetch(
      `https://api.trigger.dev/api/v1/tasks/${ffmpegProcessMediaTriggerId}/trigger`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TRIGGER_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: args,
        }),
      },
    );
    return;
  },
});
