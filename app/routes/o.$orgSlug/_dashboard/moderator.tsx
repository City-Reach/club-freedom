import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/moderator")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
