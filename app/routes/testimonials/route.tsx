import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/testimonials")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
