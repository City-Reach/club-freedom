import { createFileRoute } from "@tanstack/react-router";
import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";

export const apiRoute = "/api/turnstile";
export const Route = createFileRoute(apiRoute)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const verifyEndpoint = process.env.TURNSTILE_VERIFY_ENDPOINT!;
        const secret = process.env.TURNSTILE_SECRET_KEY!;

        const { token } = (await request.json()) as { token: string };
        const res = await fetch(verifyEndpoint, {
          method: "POST",
          body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });

        const data = (await res.json()) as TurnstileServerValidationResponse;

        return new Response(JSON.stringify(data), {
          status: data.success ? 200 : 400,
          headers: {
            "content-type": "application/json",
          },
        });
      },
    },
  },
});
