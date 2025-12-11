import EditOrganizationForm from "@/components/organization/edit-organization-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/settings")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Setting",
    };
  },
});

function RouteComponent() {
  const { organization } = Route.useRouteContext();
  return (
    <div className="grid max-w-3xl mx-auto w-full gap-4">
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
