import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
  adminClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/convex/betterAuth/auth";
import { ac, admin, member, owner } from "@/lib/auth/orgPermissions";
import { adminOptions } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminOptions),
    convexClient(),
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});
