import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
  adminClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/convex/betterAuth/auth";
import { adminRBAC } from "./permissions/admin";
import { organizationRBAC } from "./permissions/organization";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminRBAC),
    convexClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      ...organizationRBAC,
    }),
  ],
});
