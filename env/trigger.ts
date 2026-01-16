import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  server: {
    R2_ENDPOINT: z.url(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_BUCKET: z.string(),
    GROQ_API_KEY: z.string(),
    AI_GATEWAY_ENDPOINT: z.url(),
    AI_GATEWAY_API_TOKEN: z.string(),
    CONVEX_URL: z.url(),
    POSTHOG_API_KEY: z.string(),
    POSTHOG_HOST: z.url(),
  },
  runtimeEnv: process.env,
});
