import { Button } from "./ui/button";
import { isModOrAdmin } from "@/convex/lib/permissions";
import Logo from "./logo";
import UserDropDown from "./user-dropdown";
import { Link } from "@tanstack/react-router";
import { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  user: Doc<"user"> | null;
};

export default function Navbar({ user }: Props) {
  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
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
