import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_public")({
  component: Outlet,
  loader: async ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
});
