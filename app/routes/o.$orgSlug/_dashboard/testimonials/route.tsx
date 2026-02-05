import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials")({
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
