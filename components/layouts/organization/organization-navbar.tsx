import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import UserDropDown from "@/components/user-dropdown";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";

type Props = {
  organization: Doc<"organization">;
};

export default function OrganizationNavbar({ organization }: Props) {
  const { data } = authClient.useSession();

  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/o/$orgSlug"
          params={{ orgSlug: organization.slug }}
          className="flex h-16 items-center justify-center"
        >
          <img
            className="h-10"
            src="/city_reach_logo.svg"
            alt="city-reach-logo"
          ></img>
        </Link>
        {data && (
          <div className="flex items-center gap-4">
            <Button variant="link" asChild>
              <Link
                to="/o/$orgSlug/testimonials"
                params={{ orgSlug: organization.slug }}
              >
                Testimonials
              </Link>
            </Button>
          </div>
        )}
      </div>
      {data ? (
        <UserDropDown />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
