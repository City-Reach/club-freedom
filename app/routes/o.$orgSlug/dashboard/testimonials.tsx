import { createFileRoute } from "@tanstack/react-router";
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const canManageTestimonials = await context.queryClient.ensureQueryData(
      hasPermissionQuery(
        {
          testimonial: ["view", "approve"],
        },
        context.organization._id,
      ),
    );

    if (!canManageTestimonials) {
      throw new Error("User does not have permission to manage testimonials");
    }
  },
});

function RouteComponent() {
  return <div></div>;
}
