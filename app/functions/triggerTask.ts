import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk";
import type { Id } from "@/convex/_generated/dataModel";
import type { ffmpegProcessMedia } from "@/src/trigger/ffmpeg-process-media";

export const triggerTaskServerFn = createServerFn()
  .inputValidator(
    (data: { testimonialId: Id<"testimonials">; mediaKey: string }) => data,
  )
  .handler(async ({ data }) => {
    const handle = await tasks.trigger<typeof ffmpegProcessMedia>(
      "ffmpeg-process-media",
      {
        testimonialId: data.testimonialId,
        mediaKey: data.mediaKey,
      },
    );

    //return a success response with the handle
    const resp = Response.json(handle);
    return resp;
  });
