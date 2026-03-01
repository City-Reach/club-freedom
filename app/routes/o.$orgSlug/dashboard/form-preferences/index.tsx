import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import FormPreferenceCreationForm from "@/components/form-preferences/form-preference-form";
import FormPreferenceList from "@/components/form-preferences/form-preference-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import FormPreferenceDetail from "./-components/form-preference-detail";
import { useFormPreferenceIdParam } from "./-components/hook";
import LoadingFormPreference from "./-components/loading-form-preference";
export const Route = createFileRoute("/o/$orgSlug/dashboard/form-preferences/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { formPreferenceId } = useFormPreferenceIdParam();
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ScrollArea
        className={cn(
          "flex flex-col h-full relative w-full @4xl/dashboard:w-120",
          formPreferenceId && "hidden @4xl/dashboard:block",
        )}
      >
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
            </CardHeader>
            <CardContent>
              <FormPreferenceList />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      {formPreferenceId ? (
        <ScrollArea className="flex-1 h-full @4xl/dashboard:border-border @4xl/dashboard:border-l">
          <div className="p-4 @4xl/dashboard:pt-8 flex flex-col gap-8 max-w-xl mx-auto">
            <Suspense fallback={<LoadingFormPreference />}>
              <FormPreferenceDetail formPreferenceId={formPreferenceId} />
            </Suspense>
          </div>
        </ScrollArea>
      ) : (
        <Empty className="hidden @4xl/dashboard:block flex-col flex-1 h-full bg-muted rounded-none">
          <EmptyDescription>Select a form preference to view</EmptyDescription>
        </Empty>
      )}
    </div>
  );
}
