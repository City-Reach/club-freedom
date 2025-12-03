import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/members")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Members",
  }),
});

function RouteComponent() {
  return <div>Hello "/o/$slug/members"!</div>;
}
