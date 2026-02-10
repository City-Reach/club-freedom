import { useRouteContext } from "@tanstack/react-router";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { ALL_ROLES, type Role } from "@/lib/auth/permissions/organization";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listMemberQuery } from "./organization-member-list";

type Props = {
  member: typeof authClient.$Infer.Member;
};

export default function OrganizationMemberListItem({ member }: Props) {
  return (
    <li className="flex justify-between">
      <div>
        <div className="font-semibold">{member.user.name}</div>
        <div className="text-muted-foreground">{member.user.email}</div>
      </div>
      <div>
        <MemberRoleDropdown member={member} />
      </div>
    </li>
  );
}

function MemberRoleDropdown({ member }: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const queryClient = useQueryClient();
  const queryKey = listMemberQuery(organization).queryKey;

  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: async (role: Role) => {
      const { error } = await authClient.organization.updateMemberRole({
        memberId: member.id,
        organizationId: organization._id,
        role,
      });
      if (error) throw error;
    },
    onMutate: async (newRole: Role) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          members: old.members.map((m) =>
            m.id === member.id ? { ...m, role: newRole } : m,
          ),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Member role updated successfully");
    },
    onError: (error, _newRole, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Failed to update member role", {
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <Select disabled={isPending} value={member.role} onValueChange={updateRole}>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ALL_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
