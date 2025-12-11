import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/moderator")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
