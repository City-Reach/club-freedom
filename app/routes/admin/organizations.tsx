import NewOrganizationDialog from "@/components/forms/new-organization-form";
import OrganizationList from "@/components/organization-list";
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
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <NewOrganizationDialog
          trigger={
            <Button className="place-self-end">
              <Plus /> New Organization
            </Button>
          }
        />
        <OrganizationList />
      </div>
    </div>
  );
}
