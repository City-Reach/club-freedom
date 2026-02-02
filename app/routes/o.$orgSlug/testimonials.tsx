import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/testimonials")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
