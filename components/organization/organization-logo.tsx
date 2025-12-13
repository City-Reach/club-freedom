import { Link } from "@tanstack/react-router";
import type { Doc } from "@/convex/betterAuth/_generated/dataModel";

type Props = {
  organization: Doc<"organization">;
};

export default function OrganizationLogo({ organization }: Props) {
  return (
    <Link to="/o/$orgSlug" params={{ orgSlug: organization.slug }}>
      {organization.logo ? (
        <img
          src={organization.logo}
          alt={organization.name}
          height={32}
          className="size-full"
        />
      ) : (
        <span>{organization.name}</span>
      )}
    </Link>
  );
}
