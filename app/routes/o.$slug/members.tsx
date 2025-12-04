import InviteMemberForm from "@/components/forms/invite-member-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/members")({
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
    </div>
  );
}
