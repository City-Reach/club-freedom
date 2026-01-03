import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk";
import type { ffmpegCompressMedia } from "@/src/trigger/ffmpeg-compress-media";

export const triggerTaskServerFn = createServerFn()
  .inputValidator((data: { testimonialId: string; mediaKey: string }) => data)
  .handler(async ({ data }) => {
    const handle = await tasks.trigger<typeof ffmpegCompressMedia>(
      "ffmpeg-compress-media",
      {
        testimonialId: data.testimonialId,
        mediaKey: data.mediaKey,
      },
    );

    //return a success response with the handle
    const resp = Response.json(handle);
    return resp;
  });
