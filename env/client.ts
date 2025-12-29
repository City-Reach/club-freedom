import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_CONVEX_URL: z.url().refine((value) => value.endsWith("convex.cloud")),
    VITE_CONVEX_SITE_URL: z
      .url()
      .refine((value) => value.endsWith("convex.site")),
    VITE_SITE_URL: z.url(),
    VITE_TURNSTILE_SITE_KEY: z.string(),
    VITE_PUBLIC_POSTHOG_KEY: z.string(),
    VITE_PUBLIC_POSTHOG_HOST: z.url(),
  },
  runtimeEnv: import.meta.env,
});
