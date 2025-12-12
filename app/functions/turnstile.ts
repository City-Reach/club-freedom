import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { createServerFn } from "@tanstack/react-start";
import { testimonialSchema } from "@/lib/schema/testimonials";

const tokenValidator = testimonialSchema.pick({ turnstileToken: true });

export const validateTurnstileTokenServerFn = createServerFn()
  .inputValidator(tokenValidator)
  .handler(async ({ data }) => {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    const verifyEndpoint = process.env.TURNSTILE_VERIFY_ENDPOINT;
    if (!secretKey) {
      throw new Error("Turnstile secret key is not configured");
    }

    if (!verifyEndpoint) {
      throw new Error("Turnstile verify endpoint is not configured");
    }

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

    return responseData.success;
  });
