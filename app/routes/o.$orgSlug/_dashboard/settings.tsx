import { createFileRoute } from "@tanstack/react-router";
import EditOrganizationForm from "@/components/organization/edit-organization-form";
import OrganizationIconCropper from "@/components/organization/organization-icon-cropper";
import OrganizationLogoForm from "@/components/organization/organization-logo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/settings")({
  component: RouteComponent,
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
          <EditOrganizationForm
            key={organization._id}
            organization={{
              id: organization._id,
              name: organization.name,
              slug: organization.slug,
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationLogoForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Icon</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationIconCropper />
        </CardContent>
      </Card>
    </div>
  );
}
