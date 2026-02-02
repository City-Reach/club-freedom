import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { LogOut, Shield, UserCog, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/auth/types";
import { hasPermissionQuery } from "@/lib/query";

type Props = {
  user: User;
};

export default function OrganizationDropdown({ user }: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery(
      {
        testimonial: ["approve"],
      },
      organization._id,
    ),
  );

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
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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
