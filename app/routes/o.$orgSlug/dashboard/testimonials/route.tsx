import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials")({
  component: Outlet,
  loader: async ({ context }) => {
    const { data } = await authClient.organization.hasPermission({
      permissions: {
        testimonial: ["view"],
      },
      organizationId: context.organization._id,
    });

    if (!data) {
      throw new Error("User does not have permission to view testimonials");
    }
  },
});
