import { createFileRoute } from "@tanstack/react-router";
import OrganizationMemberInviteForm from "@/components/organization/organization-member-invite-form";
import OrganizationMemberList from "@/components/organization/organization-member-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/o/$orgSlug/dashboard/members")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const canManageMembers = await context.queryClient.ensureQueryData(
      hasPermissionQuery(
        {
          member: ["update", "delete"],
          invitation: ["create", "cancel"],
        },
        context.organization._id,
      ),
    );

    if (!canManageMembers) {
      throw new Error("User does not have permission to manage members");
    }
  },
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Invite member</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationMemberInviteForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationMemberList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invites</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
