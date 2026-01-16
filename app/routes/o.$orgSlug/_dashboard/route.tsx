import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { setActiveOrganization } from "@/app/functions/organization";
import OrganizationLayout from "@/components/layouts/organization";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    if (error.message === "UNAUTHORIZED") {
      return <>Unauthorized</>;
    }
    return <div>Something went wrong: {error.message}</div>;
  },
  beforeLoad: async ({ context, params }) => {
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
      organization: context.organization,
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
