import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const postTestimonialHttpAction = httpAction(async (ctx, req) => {
  if (req.method !== "POST") {
    return new Response("Method must be POST", { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { name, email, storageId, media_type, text } = body || {};

  if (!name || !media_type) {
    return new Response("Missing required fields: name or media_type", {
      status: 400,
    });
  }

  try {
    const id = await ctx.runMutation(api.testimonials.postTestimonial, {
      name,
      email,
      storageId,
      media_type,
      text,
    });

    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
