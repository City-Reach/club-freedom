import { createServerFn } from "@tanstack/react-start";
import { tasks } from "@trigger.dev/sdk";
import type { ffmpegCompressVideo } from "@/src/trigger/ffmpeg-compress-media";

export const triggerTaskServerFn = createServerFn()
  .inputValidator(
    (data: {
      name: string;
      email: string | undefined;
      text: string;
      mediaKey: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const handle = await tasks.trigger<typeof ffmpegCompressVideo>(
      "ffmpeg-compress-video",
      {
        name: data.name,
        email: data.email,
        text: data.text,
        mediaKey: data.mediaKey,
      },
    );

    //return a success response with the handle
    return Response.json(handle);
  });
