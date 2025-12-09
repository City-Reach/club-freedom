import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
