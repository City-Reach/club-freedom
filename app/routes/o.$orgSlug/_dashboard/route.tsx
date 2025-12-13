import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
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
    const userOrganizations = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.getAllOrganizations, {}),
    );
    if (
      !userOrganizations.find((org) => org.slug === params.orgSlug) &&
      user.role != "admin"
    ) {
      throw new Error("UNAUTHORIZED");
    }
    return {
      user,
      userId,
      organization: context.organization,
    };
  },
  loader: async ({ context }) => {
    return {
      user: context.user,
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
