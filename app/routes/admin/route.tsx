import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });

    const { data, error } = await authClient.getSession();

    if (!data || error) {
      throw redirect({ to: "/sign-in" });
    }

    if (data.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

function PendingComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <Spinner className="size-12" />
      <p>Loading admin dashboard...</p>
    </div>
  );
}
