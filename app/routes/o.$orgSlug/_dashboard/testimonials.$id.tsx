import TestimonialDetail from "@/components/testimonial-detail";
import type { Id } from "@/convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials/$id")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <div className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <TestimonialDetail id={id as Id<"testimonials">} />
    </div>
  );
}
