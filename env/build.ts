import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    CONVEX_DEPLOY_KEY: z.string(),
    POSTHOG_CLI_HOST: z.url(),
    POSTHOG_CLI_ENV_ID: z.string(),
    POSTHOG_CLI_TOKEN: z.string(),
    TRIGGER_ACCESS_TOKEN: z.string(),
    TRIGGER_PROJECT_REF: z.string(),
  },
  runtimeEnv: process.env,
});
