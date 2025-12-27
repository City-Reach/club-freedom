import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import OrganizationLayout from "@/components/layouts/organization";

export const Route = createFileRoute("/o/$orgSlug/_dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });
    

    return {
      userId,
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
