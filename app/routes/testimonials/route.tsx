import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getCurrentUser } from "@/app/functions/auth";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/testimonials")({
  component: RouteComponent,
  // loader: async () => {
  //   const user = await getCurrentUser();
  //   return {
  //     user,
  //   };
  // },
});

function RouteComponent() {

  return (
    <>
      <Navbar user={null} />
      <Outlet />
    </>
  );
}
