import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import type { AdminPermissionCheck } from "@/lib/auth/permissions/admin";

export function hasPermissionQuery(permissions: AdminPermissionCheck) {
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
