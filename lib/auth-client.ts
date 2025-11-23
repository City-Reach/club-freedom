import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import type { auth } from "@/convex/betterAuth/auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    convexClient(),
  ],
});
