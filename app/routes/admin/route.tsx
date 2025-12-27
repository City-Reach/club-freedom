import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminLayout from "@/components/layouts/admin";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: RouteComponent,
  pendingComponent: PendingComponent,
  beforeLoad: async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw redirect({ to: "/sign-in" });

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
      userId,
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

function PendingComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <Spinner className="size-12" />
      <p>Loading admin dashboard...</p>
    </div>
  );
}
