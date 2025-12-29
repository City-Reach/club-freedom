import { createFileRoute, redirect } from "@tanstack/react-router";
import EditOrganizationForm from "@/components/organization/edit-organization-form";
import OrganizationIconCropper from "@/components/organization/organization-icon-cropper";
import OrganizationLogoForm from "@/components/organization/organization-logo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      organizationId: context.organization._id,
      permissions: {
        organization: ["update"],
      },
    });
    if (!data?.success) {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });
    }
  },
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();

  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto">
      <h2 className="pb-2 text-3xl font-semibold tracking-tight">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <EditOrganizationForm organization={organization} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationLogoForm organization={organization} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationIconCropper organization={organization} />
        </CardContent>
      </Card>
    </div>
  );
}
