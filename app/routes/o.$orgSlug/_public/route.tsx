import { createFileRoute, Outlet } from "@tanstack/react-router";
import OrganizationNavbar from "@/components/organization/organization-navbar";

export const Route = createFileRoute("/o/$orgSlug/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <OrganizationNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
