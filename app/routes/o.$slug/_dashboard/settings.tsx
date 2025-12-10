import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/settings")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Setting",
    };
  },
});

function RouteComponent() {
  return <div></div>;
}
