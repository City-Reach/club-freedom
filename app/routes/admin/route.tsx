import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser),
    );

    if (!user) {
      throw redirect({ to: "/sign-in" });
    }

    if (user.role !== "admin") {
      throw redirect({ to: "/" });
    }

    return {
      user,
    };
  },
});

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
