import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import type { PermissionCheck } from "@/lib/auth/permissions";

export function hasPermissionQuery(permissions: PermissionCheck) {
  return queryOptions({
    queryKey: ["hasPermission", permissions],
    queryFn: async () => {
      const { data, error } = await authClient.admin.hasPermission({
        permissions,
      });
      if (error) {
        throw error;
      }
      return data.success;
    },
    staleTime: Infinity,
  });
}
