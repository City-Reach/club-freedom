import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import EditOrganizationForm from "@/components/organization/edit-organization-form";
import OrganizationIconCropper from "@/components/organization/organization-icon-cropper";
import OrganizationLogoForm from "@/components/organization/organization-logo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/o/$orgSlug/dashboard/settings")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const canManageOrganization = await context.queryClient.ensureQueryData(
      hasPermissionQuery(
        {
          organization: ["update"],
        },
        context.organization._id,
      ),
    );

    if (!canManageOrganization) {
      throw new Error("User does not have permission to manage organization");
    }
  },
});

function RouteComponent() {
  const { orgSlug } = Route.useParams();
  const { organization: preloadOrganization } = Route.useRouteContext();
  const { data: liveOrganization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, {
      slug: orgSlug,
    }),
  );

  const organization = (liveOrganization ||
    preloadOrganization) as Doc<"organization">;

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
