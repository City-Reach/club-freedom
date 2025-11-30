import Navbar from "@/components/navbar";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "@/lib/auth/auth-server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const checkAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const user = await fetchQuery(api.auth.getCurrentUser, {});
  return user?.role === "admin";
});

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  loader: async () => {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      throw redirect({
        to: "/",
      });
    }
    return isAdmin;
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
