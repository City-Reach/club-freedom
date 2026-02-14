import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/o/$orgSlug/_public/testimonials")({
  ssr: false,
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { organization, isAuthenticated } = context;
    if (isAuthenticated) {
      await authClient.organization.setActive({
        organizationId: organization._id,
      });
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
