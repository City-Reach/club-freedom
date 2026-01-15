import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { env } from "@/env/server";

export const validateTurnstileTokenServerFn = createServerFn()
  .inputValidator(
    z.object({
      turnstileToken: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const secretKey = env.TURNSTILE_SECRET_KEY;
    const verifyEndpoint =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    try {
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: data.turnstileToken,
        }),
      });
      const responseData =
        (await response.json()) as TurnstileServerValidationResponse;
      console.log({ ...data, ...responseData });
      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, "error-codes": [error.message] };
      }
      return { success: false, "error-codes": ["internal-error"] };
    }
  });
