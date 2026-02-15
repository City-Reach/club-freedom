import { useQueries } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  UserCog,
  UserRoundIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { getMemberRoleQuery, hasPermissionQuery } from "@/lib/query";
import { Badge } from "../ui/badge";

export default function OrganizationDropdown() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data } = authClient.useSession();

  const { role, canApprove, canUpdateOrganization } = useQueries({
    queries: [
      getMemberRoleQuery(organization._id),
      hasPermissionQuery(
        {
          testimonial: ["approve"],
        },
        organization._id,
      ),
      hasPermissionQuery(
        {
          organization: ["update"],
        },
        organization._id,
      ),
    ],
    combine: (results) => ({
      role: results[0].data,
      canApprove: results[1].data,
      canUpdateOrganization: results[2].data,
    }),
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
          {data?.user?.name}
          {role && <Badge className="px-1.5 py-px">{role}</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-sm text-muted-foreground">
          {data?.user?.email}
        </DropdownMenuLabel>
        {canApprove && (
          <DropdownMenuItem asChild>
            <Link
              to="/o/$orgSlug/dashboard"
              params={{ orgSlug: organization.slug }}
            >
              <LayoutDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {canUpdateOrganization && (
          <DropdownMenuItem asChild>
            <Link
              to="/o/$orgSlug/dashboard/settings"
              params={{ orgSlug: organization.slug }}
            >
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
        )}
        {data?.user?.role === "admin" && (
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
