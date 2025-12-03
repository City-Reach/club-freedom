import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/settings")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Settings",
  }),
});

function RouteComponent() {
  return (
    <div className="container mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Invite member</h2>
        
      </div>
    </div>
  );
}
