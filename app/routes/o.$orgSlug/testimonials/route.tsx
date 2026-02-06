import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import OrganizationNavbar from "@/components/organization/organization-navbar";

export const Route = createFileRoute("/o/$orgSlug/testimonials")({
  component: RouteComponent,
  loader: async () => {
    const user = await getCurrentUser();
    return {
      user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const { organization } = Route.useRouteContext();
  return (
    <>
      <OrganizationNavbar user={user} organization={organization} />
      <Outlet />
    </>
  );
}
