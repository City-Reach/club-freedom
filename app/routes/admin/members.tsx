import InviteMemberForm from "@/components/auth/invite-member-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/members")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex min-h-screen flex-col py-12 px-8 gap-y-12 max-w-3xl mx-auto">
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl font-bold">Invite member</h2>
        <InviteMemberForm />
      </div>

      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl font-bold">Members</h2>
      </div>
    </main>
  );
}
