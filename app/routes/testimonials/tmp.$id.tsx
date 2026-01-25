import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import TestimonialDetail from "@/components/testimonial-detail";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Id } from "@/convex/_generated/dataModel";
export const Route = createFileRoute("/testimonials/tmp/$id")({
  ssr: false,
  component: Component,
});

function Component() {
  const { id } = Route.useParams();
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="..">
          <ChevronLeft />
          Back
        </Link>
      </Button>
      <Suspense fallback={<PendingTestimonialDetail />}>
        <TestimonialDetail id={id as Id<"testimonials">} isTemp={true} />
      </Suspense>
    </div>
  );
}

function PendingTestimonialDetail() {
  return (
    <main className="max-w-xl mx-auto py-12 px-8 flex flex-col items-center">
      <Spinner className="size-8" />
      <span>Loading testimonial...</span>
    </main>
  );
}
