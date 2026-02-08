import { Link, useRouteContext } from "@tanstack/react-router";
import { Button } from "../ui/button";
import OrganizationDropdown from "./organization-dropdown";
import OrganizationLogo from "./organization-logo";

export default function OrganizationNavbar() {
  const { organization, isAuthenticated } = useRouteContext({
    from: "/o/$orgSlug",
  });

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
      {isAuthenticated ? (
        <OrganizationDropdown />
      ) : (
        <Button asChild>
          <Link to="/sign-in">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
