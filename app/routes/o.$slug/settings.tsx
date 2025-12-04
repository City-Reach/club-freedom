import OrganizationEditForm from "@/components/forms/organization-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/settings")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Settings",
  }),
});

function RouteComponent() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationEditForm />
        </CardContent>
      </Card>
    </div>
  );
}
