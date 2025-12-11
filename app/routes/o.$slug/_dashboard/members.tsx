import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/_dashboard/members")({
  component: RouteComponent,
  loader: ({ context }) => {
    return {
      crumb: "Members",
      
    };
  },
});

function RouteComponent() {
  return <div></div>;
}
