import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.slug,
      }),
    );
    if (!organization) {
      throw notFound();
    }
    return { organization };
  },
});

function RouteComponent() {
  return <Outlet />;
}
