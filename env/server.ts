import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
    TURNSTILE_SECRET_KEY: z.string(),
    TURNSTILE_VERIFY_ENDPOINT: z.url(),
  },
  runtimeEnv: process.env,
});
