import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/auth-client";
import type { OrganizationPermissionCheck } from "@/lib/auth/permissions/organization";

type Props = {
  permissions: OrganizationPermissionCheck;
  children?: ReactNode;
};

export default function HasOrganizationPermission({
  permissions,
  children,
}: Props) {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { data: hasPermission } = useQuery({
    queryKey: [
      "hasOrganizationPermission",
      { permissions, organizationId: organization._id },
    ],
    queryFn: async () => {
      const { data, error } = await authClient.organization.hasPermission({
        organizationId: organization._id,
        permissions,
      });
      if (error) throw error;
      return data.success;
    },
  });

  if (!hasPermission) return null;

  return <>{children}</>;
}
