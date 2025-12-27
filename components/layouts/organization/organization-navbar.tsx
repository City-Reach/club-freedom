import { Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import UserDropDown from "@/components/user-dropdown";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  organization: Doc<"organization">;
};

export default function OrganizationNavbar({ organization }: Props) {
  const user = useQuery(api.auth.getCurrentUser);

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
        {user && (
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
      {user && <UserDropDown user={user} />}
      {user === null && (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
