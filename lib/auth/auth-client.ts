import { convexClient } from "@convex-dev/better-auth/client/plugins";
import type { InferUserFromClient } from "better-auth";
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

const clientOption = {
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(adminRBAC),
    convexClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      ...organizationRBAC,
    }),
  ],
};

export const authClient = createAuthClient(clientOption);

export type User = InferUserFromClient<typeof clientOption>;
