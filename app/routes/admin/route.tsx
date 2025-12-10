import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { getUserById } from "@/app/functions/auth";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const userId = context.userId;
    if (!userId) {
      throw redirect({
        to: "/sign-in",
      });
    }
    const user = await getUserById({ data: { userId } });
    if (!user) {
      throw redirect({
        to: "/sign-in",
      });
    }
    if (user.role !== "admin") {
      throw redirect({
        to: "/",
      });
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
