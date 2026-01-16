import { createFileRoute, Outlet } from "@tanstack/react-router";
import OrganizationNavbar from "@/components/organization/organization-navbar";

export const Route = createFileRoute("/o/$orgSlug/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();
  return (
    <>
      <OrganizationNavbar organization={organization} />
      <Outlet />
    </>
  );
}
