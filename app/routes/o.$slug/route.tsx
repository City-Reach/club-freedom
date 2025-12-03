import { getCurrentUser } from "@/app/functions/auth";
import { listOrganizations } from "@/app/functions/organization";
import OrganizationLayout from "@/components/layouts/organization-layout";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/sign-in" });
    }
    const organizations = await listOrganizations();
    const organization = organizations.find(
      (organization) => organization.slug === params.slug,
    );
    if (!organization) {
      throw notFound();
    }
    return {
      user,
      organizations,
      current: organization,
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
