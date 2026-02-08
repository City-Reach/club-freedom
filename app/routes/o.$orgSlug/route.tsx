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

    const [user, member_role, canApprove, canUpdateOrganization] =
      await Promise.all([
        context.queryClient.ensureQueryData(
          convexQuery(api.auth.getCurrentUser),
        ),
        context.queryClient.ensureQueryData(
          convexQuery(api.auth.getMemeberRole, {
            organizationId: organization._id,
          }),
        ),
        context.queryClient.ensureQueryData(
          convexQuery(api.auth.checkUserPermissions, {
            permissions: {
              testimonial: ["approve"],
            },
            organizationId: organization._id,
          }),
        ),
        context.queryClient.ensureQueryData(
          convexQuery(api.auth.checkUserPermissions, {
            permissions: {
              organization: ["update"],
            },
            organizationId: organization._id,
          }),
        ),
      ]);

    return {
      organization,
      user,
      member_role,
      canApprove,
      canUpdateOrganization,
    };
  },
});

function Component() {
  const { organization } = Route.useRouteContext();
  return (
    <>
      <title>{organization.name}</title>
      <Outlet />
    </>
  );
}
