import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
    TURNSTILE_SECRET_KEY: z.string(),
    TRIGGER_PROJECT_REF: z.string(),
  },
  runtimeEnv: process.env,
});
