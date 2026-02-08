import { Link, useRouteContext } from "@tanstack/react-router";
import { LogOut, Settings, Shield, UserCog, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  user: Doc<"user">;
};

export default function OrganizationDropdown({ user }: Props) {
  const { member_role, organization, canApprove, canUpdateOrganization } =
    useRouteContext({
      from: "/o/$orgSlug",
    });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>
            <UserRoundIcon size={16} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center">
          {user.name}{" "}
          {member_role && <Badge className="px-1.5 py-px">{member_role}</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        {canApprove && (
          <DropdownMenuItem asChild>
            <Link
              to="/o/$orgSlug/moderator"
              params={{ orgSlug: organization.slug }}
            >
              <Shield />
              Moderator
            </Link>
          </DropdownMenuItem>
        )}
        {canUpdateOrganization && (
          <DropdownMenuItem asChild>
            <Link
              to="/o/$orgSlug/settings"
              params={{ orgSlug: organization.slug }}
            >
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <UserCog />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/sign-out">
            <LogOut />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
