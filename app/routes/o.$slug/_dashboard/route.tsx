import { getCurrentUser } from "@/app/functions/auth";
import OrganizationLayout from "@/components/layouts/organization";
import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });
    const organizations = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getAllOrganizations, {}),
    );
    if (!organizations.find((org) => org.slug === params.slug)) {
      throw notFound();
    }
    const user = await getCurrentUser();
    return {
      user,
      organizations,
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
