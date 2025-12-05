import { authClient } from "@/lib/auth/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Spinner } from "./ui/spinner";
import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { Member } from "better-auth/plugins";
import { User } from "better-auth";
import { Fragment } from "react";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ALL_ROLES,
  displayRole,
  Role,
} from "@/lib/auth/permissions/organization";
import { toast } from "sonner";

export default function MemberList() {
  const { current, user } = useLoaderData({
    from: "/o/$slug",
  });

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["members", current.id],
    queryFn: async () => {
      const { data, error } = await authClient.organization.listMembers({
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
          Cannot load members.{" "}
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

  if (data.total === 0)
    return (
      <div className="flex flex-col items-center p-4">
        <span>No members found</span>
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {data?.members.map((member, index) => (
        <Fragment key={member.id}>
          <MemberItemList
            member={member}
            isCurrentUser={member.userId === user._id}
          />
          {index + 1 < data.members.length && <Separator />}
        </Fragment>
      ))}
    </div>
  );
}

type MemberItemListProps = {
  member: Member & { user: Pick<User, "name" | "email"> };
  isCurrentUser: boolean;
};

function MemberItemList({ member, isCurrentUser }: MemberItemListProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateRole, isPending } = useMutation({
    mutationFn: async (role: Role) => {
      const { error } = await authClient.organization.updateMemberRole({
        memberId: member.id,
        role,
        organizationId: member.organizationId,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Member role updated");
      await queryClient.invalidateQueries({
        queryKey: ["members", member.organizationId],
      });
    },
    onError: (error) => {
      toast.error("Failed to update member role", {
        description: error.message,
      });
    },
  });

  return (
    <div className="flex items-center">
      <div className="grow">
        <p className="inline-flex items-center font-semibold gap-1">
          {member.user.name} {isPending && <Spinner />}
        </p>
        <p className="text-sm">{member.user.email}</p>
      </div>
      {isCurrentUser ? (
        <span>{displayRole(member.role as Role)}</span>
      ) : (
        <Select
          value={member.role}
          disabled={isPending}
          onValueChange={updateRole}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {displayRole(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
