import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Spinner } from "../ui/spinner";
import { Fragment, useTransition } from "react";
import { Separator } from "../ui/separator";
import { AppInvitation } from "@/lib/auth/app-invite/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ALL_ROLES, Role } from "@/lib/auth/permissions";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";

export default function PendingInvitations() {
  const data = useQuery(api.members.listInvitations);

  if (!data) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (data.invitations.length === 0) {
    return <div className="text-center">No invitation</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.invitations.map((invitation, index) => (
        <Fragment key={invitation.id}>
          <InvitationItem invitation={invitation} />
          {index + 1 < data.invitations.length && (
            <Separator orientation="horizontal" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

type InvitationItemProps = {
  invitation: AppInvitation;
};

function InvitationItem({ invitation }: InvitationItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateRole = async (role: Role) => {
    const { error } = await authClient.appInvite.updateInvitationRole({
      id: invitation.id,
      role,
    });

    if (error) {
      toast.error("Failed to update invitation role", {
        description: error?.message,
      });
    } else {
      toast.success("Invitation role updated");
    }
  };

  const handleDelete = async () => {
    const { error } = await authClient.appInvite.deleteInvitation({
      id: invitation.id,
    });

    if (error) {
      toast.error("Failed to delete invitation", {
        description: error?.message,
      });
    } else {
      toast.success("Invitation deleted");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="grow flex items-center">
        {invitation.email} {isPending && <Spinner className="ml-2" />}
      </span>
      <Select
        value={invitation.role}
        disabled={isPending}
        onValueChange={(role) => {
          startTransition(() => handleUpdateRole(role as Role));
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {`${role[0].toUpperCase()}${role.slice(1)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="cursor-pointer"
        size="icon"
        variant="destructive"
        disabled={isPending}
        onClick={() => startTransition(handleDelete)}
      >
        <TrashIcon />
        <span className="sr-only">
          Delete invitation for {invitation.email}
        </span>
      </Button>
    </div>
  );
}
