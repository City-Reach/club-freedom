import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials")({
  component: RouteComponent,
  loader: async () => {
    const user = await getCurrentUser();
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
