import Navbar from "@/components/navbar";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/auth/auth-server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await fetchQuery(api.auth.getCurrentUser, {});
  return user;
});

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
    return { user };
  },
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
