import { Link } from "@tanstack/react-router";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "../ui/button";
import OrganizationLogo from "./organization-logo";
import OrganizationUserDropdown from "./organization-user-dropdown";

type Props = {
  organization: Doc<"organization">;
};

export default function OrganiztionNavbar({ organization }: Props) {
  const { data } = authClient.useSession();

  return (
    <header className="border-b py-2 px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <OrganizationLogo organization={organization} />
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
      {data ? (
        <OrganizationUserDropdown user={data.user} />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
