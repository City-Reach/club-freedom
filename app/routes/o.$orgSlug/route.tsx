import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import NotFound from "@/components/not-found";

export const Route = createFileRoute("/o/$orgSlug")({
  component: () => <Outlet />,
  notFoundComponent: () => <NotFound />,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );
    if (!organization) {
      throw notFound();
    }
    return { organization };
  },
});
