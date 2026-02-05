import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";
import Footnote from "@/components/footnote";

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
      <main className="adjust-main-height">
        <Outlet />
      </main>
      <Footnote />
    </>
  );
}
