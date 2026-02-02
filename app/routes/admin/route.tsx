import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();

    if (!data) {
      throw redirect({ to: "/sign-in" });
    }

    const user = data.user;

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
