import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk";
import type { Id } from "@/convex/_generated/dataModel";
import { ffmpegProcessMediaTriggerId } from "@/lib/constants";
import type { ffmpegProcessMedia } from "@/trigger/ffmpeg-process-media";

export const triggerTaskServerFn = createServerFn()
  .inputValidator(
    (data: { testimonialId: Id<"testimonials">; mediaKey: string }) => data,
  )
  .handler(async ({ data }) => {
    const handle = await tasks.trigger<typeof ffmpegProcessMedia>(
      ffmpegProcessMediaTriggerId,
      {
        testimonialId: data.testimonialId,
        mediaKey: data.mediaKey,
      },
    );

    //return a success response with the handle
    const resp = Response.json(handle);
    return resp;
  });
