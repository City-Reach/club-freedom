import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser, {}),
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
  loader: async ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
