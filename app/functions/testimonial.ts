import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";

export const saveTestimonialForPublicView = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({ testimonialId: z.string(), organizationId: z.string() }),
  )
  .handler(({ data }) => {
    const key = `testimonials/${data.testimonialId}`;
    setCookie(key, data.organizationId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 900, // 15 minutes
    });
  });

export const isTestimonialForPublicView = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({ testimonialId: z.string(), organizationId: z.string() }),
  )
  .handler(async ({ data }) => {
    const key = `testimonials/${data.testimonialId}`;
    const cookie = getCookie(key);
    return cookie === data.organizationId;
  });
