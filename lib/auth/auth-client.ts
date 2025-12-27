import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
  adminClient,
  inferAdditionalFields,
  inferOrgAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/convex/betterAuth/auth";
import { adminOptions } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminOptions),
    convexClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});
