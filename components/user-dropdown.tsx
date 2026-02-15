import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogOut, Shield, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";

export default function UserDropdown() {
  return (
    <Suspense
      fallback={
        <Avatar aria-disabled>
          <AvatarFallback>
            <UserRoundIcon size={16} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      }
    >
      <SuspensedUserDropDown />
    </Suspense>
  );
}

function SuspensedUserDropDown() {
  const { data: user } = useSuspenseQuery(convexQuery(api.auth.getCurrentUser));

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
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuLabel>
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <Shield />
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
