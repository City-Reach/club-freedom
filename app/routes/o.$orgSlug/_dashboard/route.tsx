import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import OrganizationLayout from "@/components/layouts/organization";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });

    const { data, error } = await authClient.getSession();
    if (!data || error) {
      throw redirect({ to: "/sign-in" });
    }

    const isInOrganization = context.queryClient.ensureQueryData(
      convexQuery(api.organization.isUserInOrganization, {
        organizationId: context.organization._id,
        userId,
      }),
    );

    if (!isInOrganization)
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });

    return {
      user: data.user,
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

function PendingComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <Spinner className="size-12" />
      <p>Loading organization dashboard...</p>
    </div>
  );
}
