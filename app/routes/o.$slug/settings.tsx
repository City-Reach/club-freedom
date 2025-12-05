import OrganizationEditForm from "@/components/forms/organization-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/settings")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Settings",
  }),
});

function RouteComponent() {
  const { current } = useLoaderData({
    from: "/o/$slug",
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit organization</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationEditForm current={current} key={`edit-${current.id}`} />
        </CardContent>
      </Card>
    </div>
  );
}
