import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
