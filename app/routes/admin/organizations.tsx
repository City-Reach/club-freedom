import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/organizations")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Organizations",
    };
  },
});

function RouteComponent() {
  return <div>Organizations</div>;
}
