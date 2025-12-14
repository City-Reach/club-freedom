import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import TestimonialDetail from "@/components/testimonial-detail";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/o/$orgSlug/_dashboard/testimonials/$id")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { id } = Route.useParams();
  const { organization } = Route.useRouteContext();
  return (
    <div className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="..">
          <ChevronLeft />
          Back
        </Link>
      </Button>
      <TestimonialDetail
        id={id as Id<"testimonials">}
        organizationId={organization._id}
      />
    </div>
  );
}
