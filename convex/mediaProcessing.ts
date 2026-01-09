import { v } from "convex/values";
import { triggerTask } from "@/lib/trigger";
import type { ffmpegProcessMedia } from "@/trigger/ffmpeg-process-media";
import { action } from "./_generated/server";

export const processMedia = action({
  args: {
    testimonialId: v.id("testimonials"),
    mediaKey: v.string(),
  },
  handler: async (_ctx, { mediaKey, testimonialId }) => {
    await triggerTask<typeof ffmpegProcessMedia>("ffmpeg-process-media", {
      mediaKey,
      testimonialId,
    });
  },
});
