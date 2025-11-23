import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isModOrAdmin } from "@/convex/lib/permissions";
import Logo from "./logo";
import UserDropDown from "./user-dropdown";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const user = useQuery(api.auth.getCurrentUser);

  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Logo />
        {isModOrAdmin(user?.role) && (
          <div className="flex items-center gap-4">
            <Button variant="link" className="cursor-pointer" asChild>
              <Link to="/testimonials">Testimonials</Link>
            </Button>
          </div>
        )}
      </div>
      {user ? (
        <UserDropDown user={user} />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
