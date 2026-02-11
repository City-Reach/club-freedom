import { Link, useRouteContext } from "@tanstack/react-router";
import { UserRoundIcon } from "lucide-react";
import { Suspense } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import OrganizationDropdown from "./organization-dropdown";
import OrganizationLogo from "./organization-logo";

export default function OrganizationNavbar() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data: session } = authClient.useSession();

  return (
    <header className="border-b py-2 px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <OrganizationLogo />
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/o/$orgSlug/testimonials"
              params={{ orgSlug: organization.slug }}
            >
              Testimonials
            </Link>
          </Button>
        </div>
      </div>
      {session?.user ? (
        <OrganizationDropdown user={session.user} />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
