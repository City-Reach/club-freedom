import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AuthLayout from "@/components/layouts/auth-layout";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.userId) {
      throw redirect({
        to: "/",
      });
    }
    return {
      userId: context.userId,
    };
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
