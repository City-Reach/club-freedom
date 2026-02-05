import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug")({
  component: Component,
  beforeLoad: async ({ context, params }) => {
    const organization = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getOrganizationBySlug, {
        slug: params.orgSlug,
      }),
    );
    if (!organization) {
      throw notFound();
    }

    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser),
    );

    return { organization, user };
  },
});

function Component() {
  const { organization } = Route.useRouteContext();
  return (
    <>
      <head>
        <title>{organization.name}</title>
      </head>
      <Outlet />
    </>
  );
}
