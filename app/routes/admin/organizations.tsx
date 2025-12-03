import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/organizations")({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: "Organizations",
    };
  },
});

function RouteComponent() {
  return <div></div>;
}
