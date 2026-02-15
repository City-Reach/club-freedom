import { Link, useRouteContext } from "@tanstack/react-router";

export default function OrganizationLogo() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  return (
    <Link to="/o/$orgSlug" params={{ orgSlug: organization.slug }}>
      {organization.logo ? (
        <img src={organization.logo} alt={organization.name} className="h-10" />
      ) : (
        <span>{organization.name}</span>
      )}
    </Link>
  );
}
