import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AuthLayout from "@/components/layouts/auth-layout";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
