import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import Footnote from "@/components/footnote";
import Navbar from "@/components/navbar";

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
    <div>
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-115px)]">
        <Outlet />
      </main>
      <Footnote />
    </div>
  );
}
