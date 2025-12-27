import { Link } from "@tanstack/react-router";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { Button } from "../ui/button";
import UserDropDown from "../user-dropdown";
import OrganizationLogo from "./organization-logo";

type Props = {
  user: Doc<"user"> | null;
  organization: Doc<"organization">;
};

export default function OrganiztionNavbar({ user, organization }: Props) {
  return (
    <header className="border-b py-2 px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <OrganizationLogo organization={organization} />
        {user && (
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
