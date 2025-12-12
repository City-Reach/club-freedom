import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/o/$orgSlug/"!</div>;
}
