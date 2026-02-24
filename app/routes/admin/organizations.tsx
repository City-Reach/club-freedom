import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import NewOrganizationDialog from "@/components/admin/new-organization-dialog";
import OrganizationList from "@/components/admin/organization-list";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/organizations")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Organizations",
    };
  },
});

function RouteComponent() {
  return (
    <div className="w-full mx-auto max-w-3xl flex flex-col gap-4">
      <NewOrganizationDialog
        trigger={
          <Button className="place-self-end">
            <Plus /> New Organization
          </Button>
        }
      />
      <OrganizationList />
    </div>
  );
}
