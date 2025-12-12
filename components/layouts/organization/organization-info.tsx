import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";

export default function OrganizationInfo() {
  const { open, isMobile } = useSidebar();
  const { orgSlug } = useParams({
    from: "/o/$orgSlug",
  });
  const { data: organization } = useSuspenseQuery(
    convexQuery(api.organization.getOrganizationBySlug, { slug: orgSlug }),
  );

  if (open && !isMobile) {
    return null;
  }

  if (!organization) {
    return null;
  }

  return <span className="flex flex-col gap-4">{organization.name}</span>;
}
