import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { RefreshCcw, XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";
import { listInvitesQuery } from "./organization-invite-list";

type Props = {
  invitation: typeof authClient.$Infer.Invitation;
};

export default function OrganizationInviteListItem({ invitation }: Props) {
  return (
    <li className="flex justify-between items-center">
      <div className="text-muted-foreground">{invitation.email}</div>
      <div className="flex gap-2 items-center">
        <div className="text-sm">{invitation.role}</div>
        <OrganizationResendInvite
          invitation={invitation}
          size="sm"
          variant="outline"
          className="cursor-pointer"
        >
          <RefreshCcw /> Resend
        </OrganizationResendInvite>
        <OrganizationRevokeInvite
          invitation={invitation}
          size="sm"
          variant="destructive"
          className="cursor-pointer"
        >
          <XIcon /> Revoke
        </OrganizationRevokeInvite>
      </div>
    </li>
  );
}

function OrganizationResendInvite({
  invitation,
  ...props
}: Props & ComponentProps<typeof Button>) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.organization.inviteMember({
        email: invitation.email,
        role: invitation.role,
        organizationId: organization._id,
        resend: true,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Invitation resent");
    },
    onError: (error) => {
      toast.error("Failed to resend invitation", {
        description: error.message,
      });
    },
  });

  return <Button disabled={isPending} onClick={() => mutate()} {...props} />;
}

function OrganizationRevokeInvite({
  invitation,
  ...props
}: Props & ComponentProps<typeof Button>) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const queryClient = useQueryClient();
  const queryKey = listInvitesQuery(organization).queryKey;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.organization.cancelInvitation({
        invitationId: invitation.id,
      });
      if (error) {
        throw error;
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success("Invitation revoked");
    },
    onError: (error) => {
      toast.error("Failed to revoke invitation", {
        description: error.message,
      });
    },
  });

  return <Button disabled={isPending} onClick={() => mutate()} {...props} />;
}
