import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import type { OrganizationPermissionCheck } from "./auth/permissions/organization";

export function hasPermissionQuery(permissions: OrganizationPermissionCheck) {
  return convexQuery(api.auth.checkUserPermissions, { permissions });
}
