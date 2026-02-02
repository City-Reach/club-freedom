import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import OrganizationLayout from "@/components/layouts/organization";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  beforeLoad: async ({ context }) => {
    const { data: sessionData } = await authClient.getSession();

    if (!sessionData) {
      throw redirect({ to: "/sign-in" });
    }

    const user = sessionData.user;

    const { error } = await authClient.organization.setActive({
      organizationId: context.organization._id,
    });

    if (error) {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });
    }

    const { data: roleData } =
      await authClient.organization.getActiveMemberRole({
        query: {
          organizationId: context.organization._id,
        },
      });

    if (!roleData || roleData.role === "viewer") {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });
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

function PendingComponent() {
  const { organization } = Route.useRouteContext();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-12 p-8">
      {organization.logo ? (
        <img
          src={organization.logo}
          alt={organization.name}
          className="w-full max-w-100"
        />
      ) : (
        `Accessing to ${organization.name}`
      )}
      <Spinner className="size-12" />
    </div>
  );
}
