import { getCurrentUser } from "@/app/functions/auth";
import AdminLayout from "@/components/layouts/admin-layout";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async () => {
    const user = await getCurrentUser();
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
