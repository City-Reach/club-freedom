import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/settings")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Settings",
  }),
});

function RouteComponent() {
  return <div></div>;
}
