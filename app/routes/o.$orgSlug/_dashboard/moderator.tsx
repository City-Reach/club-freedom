import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/moderator")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      organizationId: context.organization._id,
      permissions: {
        testimonial: ["approve"],
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
