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
    const verifyEndpoint = env.TURNSTILE_VERIFY_ENDPOINT;
    try {
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: encodeURIComponent(secretKey),
          response: encodeURIComponent(data.turnstileToken),
        }),
      });

      const responseData =
        (await response.json()) as TurnstileServerValidationResponse;
      console.log({ ...data, ...responseData });

      return { success: responseData.success, error: "" };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Human Verification Failed" };
    }
  });
