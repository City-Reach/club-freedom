import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { setActiveOrganization } from "@/app/functions/organization";
import OrganizationLayout from "@/components/layouts/organization";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });

    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser, {}),
    );

    if (!user) {
      throw redirect({ to: "/sign-in" });
    }

    const inOrganization = await setActiveOrganization({
      data: { organizationId: context.organization._id },
    });

    if (!inOrganization) {
      throw notFound();
    }

    return {
      user,
      userId,
      organization: context.organization,
    };
  },
  loader: async ({ context, params }) => {
    const organizations = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getAllOrganizations, {}),
    );
    if (!organizations.find((org) => org.slug === params.orgSlug)) {
      throw notFound();
    }
    return {
      user: context.user,
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
