import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { convex } from "@/lib/convex";

export const Route = createFileRoute(
  "/o/$orgSlug/_dashboard/testimonials/$id/download",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id, orgSlug } = params;

        const organization = await convex.query(
          api.organization.getOrganizationBySlug,
          {
            slug: orgSlug,
          },
        );

        if (!organization) {
          return new Response("Organization not found", { status: 404 });
        }

        const url = await convex.action(api.media.generateMediaDownloadUrl, {
          id: id as Id<"testimonials">,
          organizationId: organization._id,
        });

        if (!url) {
          return new Response("Media not found", { status: 404 });
        }

        return Response.redirect(url);
      },
    },
  },
});
