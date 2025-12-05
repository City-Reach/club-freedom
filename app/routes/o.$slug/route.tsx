import OrganizationLayout from "@/components/layouts/organization-layout";
import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser, {}),
    );
    if (!user) {
      throw redirect({ to: "/sign-in" });
    }
    const organizations = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.listOrganizations, {}),
    );
    const organization = organizations.find(
      (organization) => organization.slug === params.slug,
    );
    if (!organization) {
      throw notFound();
    }
    return {
      user,
      organizations,
      current: organization,
    };
  },
});

function RouteComponent() {
  return (
    <OrganizationLayout>
      <Outlet />
    </OrganizationLayout>
  );
}
