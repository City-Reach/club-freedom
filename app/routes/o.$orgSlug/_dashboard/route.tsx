import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import OrganizationLayout from "@/components/layouts/organization";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ context }) => {
    const { data, error } = await authClient.getSession();
    if (!data || error) {
      throw redirect({ to: "/sign-in" });
    }

    const isInOrganization = context.queryClient.ensureQueryData(
      convexQuery(api.organization.isUserInOrganization, {
        organizationId: context.organization._id,
        userId: data.user.id,
      }),
    );

    if (!isInOrganization)
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });

    return {
      user: data.user,
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
  const { organization } = useLoaderData({
    from: "/o/$orgSlug",
  });
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-12">
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
