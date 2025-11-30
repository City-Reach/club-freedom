import InviteMemberForm from "@/components/auth/invite-member-form";
import ActiveMembers from "@/components/members/active-members";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/admin/members")({
  component: RouteComponent,
  validateSearch: z.object({
    status: z.enum(["active", "pending"]).default("active"),
  }),
});

function RouteComponent() {
  const { status } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col py-12 px-8 gap-y-12 max-w-3xl mx-auto">
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl font-bold">Invite member</h2>
        <InviteMemberForm />
      </div>

      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl font-bold">Members</h2>
        <Tabs value={status} className="gap-4">
          <TabsList>
            <TabsTrigger
              value="active"
              onClick={() =>
                navigate({ to: ".", search: { status: "active" } })
              }
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              onClick={() =>
                navigate({ to: ".", search: { status: "pending" } })
              }
            >
              Pending
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <ActiveMembers />
          </TabsContent>
          <TabsContent value="pending"></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
