import { Link } from "@tanstack/react-router";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import Logo from "./logo";
import { Button } from "./ui/button";
import UserDropDown from "./user-dropdown";

type Props = {
  user: Doc<"user"> | null;
  organization?: Doc<"organization"> | undefined;
};

export default function Navbar({ user, organization }: Props) {
  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <Logo organization={organization} />
        {user && (
          <div className="flex items-center gap-4">
            <Button variant="link" className="cursor-pointer" asChild>
              <Link to="/testimonials">Testimonials</Link>
            </Button>
          </div>
        )}
      </div>

      {user ? (
        <UserDropDown />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
