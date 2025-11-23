import TestimonialDetail from "@/components/testimonial-detail";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/testimonials/$id")({
  component: TestimonialDetailPage,
});

function TestimonialDetailPage() {
  const { id } = Route.useParams();
  return (
    <div className="max-w-lg mx-auto py-12 px-8 space-y-4">
      <Authenticated>
        <Button variant="link" className="px-0!" asChild>
          <Link to="..">
            <ChevronLeft />
            Back
          </Link>
        </Button>
      </Authenticated>
      <TestimonialDetail id={id as Id<"testimonials">} />
    </div>
  );
}
