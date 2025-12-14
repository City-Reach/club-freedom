import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/convex/betterAuth/auth";
import { adminOptions } from "./permissions/admin";
import { organizationOptions } from "./permissions/organization";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminOptions),
    organizationClient(organizationOptions),
    convexClient(),
    organizationClient(),
  ],
});
