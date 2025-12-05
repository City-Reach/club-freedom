import InviteMemberForm from "@/components/forms/invite-member-form";
import InviteList from "@/components/invite-list";
import MemberList from "@/components/member-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/members")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Members",
  }),
});

function RouteComponent() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Invite member</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteMemberForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invites</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteList />
        </CardContent>
      </Card>
    </div>
  );
}
