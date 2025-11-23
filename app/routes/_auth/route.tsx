import AuthLayout from "@/components/layouts/auth-layout";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Unauthenticated } from "convex/react";

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
