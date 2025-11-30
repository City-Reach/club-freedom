import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOutIcon, UserRoundIcon, UsersIcon } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  user: Doc<"user">;
};

export default function UserDropDown({ user }: Props) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/sign-in" });
  };

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
        <DropdownMenuLabel>
          {user.name} ({user.role})
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin/members">
                <UsersIcon />
                Members
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
