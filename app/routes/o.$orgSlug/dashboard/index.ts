import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/dashboard/")({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: "/o/$orgSlug/dashboard/testimonials",
      params,
    });
  },
});
