import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { CircleAlert, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Invitation } from "better-auth/plugins";
import { Fragment } from "react";
import { Separator } from "./ui/separator";
import { displayRole, Role } from "@/lib/auth/permissions/organization";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function InviteList() {
  const { current } = useLoaderData({
    from: "/o/$slug",
  });

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["invites", current.id],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listInvitations({
        query: {
          organizationId: current.id,
        },
      });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <Spinner className="size-4" />
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <CircleAlert className="size-4" />
        <span className="text-sm">
          Cannot load invites.{" "}
          <Button
            variant="link"
            className="p-0! cursor-pointer"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </span>
        <span>{error?.message}</span>
      </div>
    );
  }

  const pendingInvites = data.filter((invite) => invite.status === "pending");

  if (pendingInvites.length === 0)
    return (
      <div className="flex flex-col items-center p-4">
        <span>No invites found</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {pendingInvites.map((invite, index) => (
        <Fragment key={invite.id}>
          <InviteItem invite={invite} />
          {index + 1 < pendingInvites.length && (
            <Separator orientation="horizontal" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

type InviteItemListProps = {
  invite: Invitation;
};

function InviteItem({ invite }: InviteItemListProps) {
  const queryClient = useQueryClient();

  const { mutate: cancelInvitation, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.organization.cancelInvitation({
        invitationId: invite.id,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Invite cancelled");
      queryClient.invalidateQueries({
        queryKey: ["invitations", invite.organizationId],
      });
    },
    onError: (error) => {
      toast.error("Cannot cancel invitation", {
        description: error.message,
      });
    },
  });

  return (
    <div className="flex items-center">
      <div className="grow">
        <div className="flex items-center gap-2 font-semibold">
          {invite.email} {isPending && <Spinner />}
        </div>
        <p className="text-sm">{displayRole(invite.role as Role)}</p>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size="icon"
            variant="destructive"
            type="button"
            onClick={() => cancelInvitation()}
            disabled={isPending}
          >
            <TrashIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Cancel this invitation</TooltipContent>
      </Tooltip>
    </div>
  );
}
