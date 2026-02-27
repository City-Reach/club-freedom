import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import FormPreferenceForm from "@/components/form-preferences/form-preference-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormPreferenceList from "@/components/form-preferences/form-preference-list";
export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-8 mx-auto p-4">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>Forms</CardTitle>
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
              <FormPreferenceForm />
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
        </CardHeader>
        <FormPreferenceList />
      </Card>
    </div>
  );
}
