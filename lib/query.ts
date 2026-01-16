import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import type { OrganizationPermissionCheck } from "@/lib/auth/permissions/organization";

export function hasPermissionQuery(permissions: OrganizationPermissionCheck) {
  return queryOptions({
    queryKey: ["hasPermission", permissions],
    queryFn: async () => {
      const { data } = await authClient.admin.hasPermission({
        permissions,
      });
      return data?.success || false;
    },
    staleTime: Infinity,
  });
}