import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { putTestimonialHttpAction } from "./http/testimonials";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/putTestimonialHttpAction",
  method: "PUT",
  handler: putTestimonialHttpAction,
});

export default http;
