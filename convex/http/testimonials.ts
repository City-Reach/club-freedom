import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const putTestimonialHttpAction = httpAction(async (ctx, req) => {
  if (req.method !== "PUT") {
    return new Response("Method must be PUT", { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }
  const { testimonialId, storageId } = body || {};

  try {
    //todo change this to put
    await ctx.runMutation(api.testimonials.updateTestimonialStorageId, {
      id: testimonialId,
      storageId,
    });

    return new Response(JSON.stringify({ testimonialId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
