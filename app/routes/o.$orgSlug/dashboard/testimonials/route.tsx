import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials")({
  component: RouteComponent,
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

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
