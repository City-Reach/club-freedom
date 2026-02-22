import { Link, useRouteContext } from "@tanstack/react-router";
import Logo from "./logo";
import { Button } from "./ui/button";
import UserDropDown from "./user-dropdown";

export default function Navbar() {
  const { isAuthenticated } = useRouteContext({
    from: "/",
  });

  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <Logo />
      </div>

      {isAuthenticated ? (
        <UserDropDown />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
