import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import FormPreferenceCreationForm from "@/components/form-preferences/form-preference-creation-form";
import FormPreferenceList from "@/components/form-preferences/form-preference-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-4 mx-auto p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="ml-auto">
            <PlusIcon /> New Form
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
          </DialogHeader>
          <FormPreferenceCreationForm />
          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" form="organization-form-preference">
                Create Form
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FormPreferenceList />
    </div>
  );
}
