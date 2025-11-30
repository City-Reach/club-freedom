import { Spinner } from "../ui/spinner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserWithRole } from "better-auth/plugins";
import { Separator } from "../ui/separator";
import { Fragment, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ALL_ROLES, displayRole, Role } from "@/lib/auth/permissions";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useLoaderData } from "@tanstack/react-router";
import { Badge } from "../ui/badge";

export default function ActiveMembers() {
  const members = useQuery(api.members.listMembers);
  const { user } = useLoaderData({
    from: "/admin",
  });

  if (!members) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <Spinner />
        Loading...
      </div>
    );
  }

  if (members.total === 0) {
    return <div className="text-center">No other members</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {members.users.map((member, index) => (
        <Fragment key={member.id}>
          <ActiveMembersItem member={member} isSelf={user._id === member.id} />
          {index + 1 < members.total && <Separator orientation="horizontal" />}
        </Fragment>
      ))}
    </div>
  );
}

type ActiveMembersItemProps = {
  member: UserWithRole;
  isSelf: boolean;
};

function ActiveMembersItem({ member, isSelf }: ActiveMembersItemProps) {
  const [isUpdating, startUpdating] = useTransition();

  const updateRole = async (role: Role) => {
    const { data, error } = await authClient.admin.setRole({
      userId: member.id,
      role,
    });

    if (error || !data.user) {
      toast.error("Cannot update role");
    } else {
      toast.success(`Role updated for ${data.user.name}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-y-2">
      <div>
        <div className="font-semibold flex gap-2 items-center">
          {member.name} {isSelf && <Badge variant="outline">You</Badge>}
        </div>
        <div className="text-xs">{member.email}</div>
      </div>
      <div className="flex items-center gap-2">
        {isUpdating && <Spinner />}
        {isSelf ? (
          <span className="text-sm">{displayRole(member.role as Role)}</span>
        ) : (
          <Select
            disabled={isUpdating}
            value={member.role}
            onValueChange={(role) =>
              startUpdating(() => updateRole(role as Role))
            }
          >
            <SelectTrigger className="w-[120px]">
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
    </div>
  );
}
