import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/moderator")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Moderator",
    };
  },
});

function RouteComponent() {
  return <div></div>;
}
