import { convexClient } from "@convex-dev/better-auth/client/plugins";
import type { BetterAuthClientOptions, InferUserFromClient } from "better-auth";
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

export const authClientOption = {
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminRBAC),
    convexClient(),
    organizationClient({
      ...organizationRBAC,
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
} satisfies BetterAuthClientOptions;

export const authClient = createAuthClient(authClientOption);

export type User = InferUserFromClient<typeof authClientOption>;
