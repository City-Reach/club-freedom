import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { postTestimonialHttpAction } from "./http/testimonials";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/postTestimonialHttpAction",
  method: "POST",
  handler: postTestimonialHttpAction,
});

export default http;
