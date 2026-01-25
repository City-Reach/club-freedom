import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import TestimonialDetail from "@/components/testimonial-detail";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
export const Route = createFileRoute("/testimonials/tmp/$id")({
  ssr: false,
  component: Component,
  loader: async (opts) => {
    const testimonial = await opts.context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialById, {
        id: opts.params.id as Id<"testimonials">,
      }),
    );
    if (!testimonial) {
      throw notFound();
    }
    //_creationTime is the milliseconds since unix epoch when the document was created
    const expirationDate = testimonial._creationTime + 15 * 60000;
    if (Date.now() >= expirationDate) {
      throw notFound();
    }
    return { timeRemaining: Math.floor((expirationDate - Date.now()) / 60000) };
  },
});

function Component() {
  const { timeRemaining } = Route.useLoaderData();
  let timeRemainingString = `${timeRemaining} minutes before this temporary view expires`;
  if (timeRemaining <= 0) {
    timeRemainingString =
      "Less than a minute before this temporary view expires";
  }
  const { id } = Route.useParams();
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <p>{timeRemainingString}</p>
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
