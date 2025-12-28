import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/members")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      organizationId: context.organization._id,
      permissions: {
        member: ["update"],
        invitation: ["create"],
      },
    });
    if (!data?.success) {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: context.organization.slug },
      });
    }
  },
});

function RouteComponent() {
  return <div></div>;
}
