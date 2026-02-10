import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import Footnote from "@/components/footnote";
import Navbar from "@/components/navbar";

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
    <div>
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-115px)]">
        <Outlet />
      </main>
      <Footnote />
    </div>
  );
}
