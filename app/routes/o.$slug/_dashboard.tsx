import OrganizationLayout from "@/components/layouts/organization-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <OrganizationLayout>
      <Outlet />
    </OrganizationLayout>
  );
}
