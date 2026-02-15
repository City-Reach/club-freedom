import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import OrganizationInviteForm from "@/components/organization/organization-invite-form";
import OrganizationInviteList from "@/components/organization/organization-invite-list";
import OrganizationMemberList from "@/components/organization/organization-member-list";
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
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/o/$orgSlug/dashboard/members")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const canManageMembers = await context.queryClient.ensureQueryData(
      hasPermissionQuery(
        {
          member: ["update", "delete"],
          invitation: ["create", "cancel"],
        },
        context.organization._id,
      ),
    );

    if (!canManageMembers) {
      throw new Error("User does not have permission to manage members");
    }
  },
});

function RouteComponent() {
  return (
    <div className="grid max-w-3xl w-full gap-8 mx-auto">
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle>Invites</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto">
                <PlusIcon /> New invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite new member</DialogTitle>
              </DialogHeader>
              <OrganizationInviteForm />
              <DialogFooter className="justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" form="organization-invite-form">
                    Send invite
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <OrganizationInviteList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationMemberList />
        </CardContent>
      </Card>
    </div>
  );
}
