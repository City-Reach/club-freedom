import { createFileRoute } from "@tanstack/react-router";
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
  return <div></div>;
}
