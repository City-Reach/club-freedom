import EditOrganizationForm from "@/components/organization/edit-organization-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();
  return (
    <div className="grid max-w-3xl w-full gap-4">
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
    </div>
  );
}
