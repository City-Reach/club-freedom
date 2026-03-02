import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import FormPreferenceList from "@/components/form-preferences/form-preference-list";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Button size="sm" className="ml-auto" asChild>
        <Link from={Route.fullPath} to="new">
          <PlusIcon /> New Form
        </Link>
      </Button>
      <FormPreferenceList />
    </div>
  );
}
