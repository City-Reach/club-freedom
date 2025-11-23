import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import type { auth } from "@/convex/betterAuth/auth";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles,
    }),
    convexClient(),
  ],
});
