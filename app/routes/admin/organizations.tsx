import NewOrganizationDialog from "@/components/forms/new-organization-form";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/organizations")({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: "Organizations",
    };
  },
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-4">
        <NewOrganizationDialog
          trigger={
            <Button className="place-self-end">
              <Plus /> New Organization
            </Button>
          }
        />
      </div>
    </div>
  );
}
