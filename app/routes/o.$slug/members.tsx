import InviteMemberForm from "@/components/forms/invite-member-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/members")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Members",
  }),
});

function RouteComponent() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 py-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Invite member</h2>
        <InviteMemberForm />
      </div>
    </div>
  );
}
