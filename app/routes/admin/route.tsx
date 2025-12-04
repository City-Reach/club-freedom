import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/auth/auth-server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async () => {
    const user = await getCurrentUser();
    if (user?.role !== "admin") {
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
  const { user } = Route.useLoaderData();
  return (
    <>
      <Navbar user={user} />
      <Outlet />
    </>
  );
}
