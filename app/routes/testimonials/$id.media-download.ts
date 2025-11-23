import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials/$id/media-download")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params;

        const url = await convex.action(api.media.generateMediaDownloadUrl, {
          id,
        } as { id: Id<"testimonials"> });

        if (!url) {
          return new Response("Media not found", { status: 404 });
        }

        return Response.redirect(url);
      },
    },
  },
});
