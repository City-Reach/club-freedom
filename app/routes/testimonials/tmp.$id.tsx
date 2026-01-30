import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, TimerIcon } from "lucide-react";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const Route = createFileRoute("/testimonials/tmp/$id")({
  ssr: false,
  component: Component,
  loader: async ({ context, params }) => {
    const testimonial = await context.queryClient.ensureQueryData(
      convexQuery(api.testimonials.getTestimonialById, {
        id: params.id as Id<"testimonials">,
      }),
    );

    if (!testimonial) {
      throw notFound();
    }

    // _creationTime is the milliseconds since unix epoch when the document was created
    const expirationDate = testimonial._creationTime + 900_000;
    if (Date.now() >= expirationDate) {
      throw notFound();
    }
    return { testimonial, expirationDate };
  },
});

function Component() {
  const { testimonial, expirationDate } = Route.useLoaderData();

  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="/testimonials">
          <ChevronLeft />
          Back
        </Link>
      </Button>

      <TestimonialContext.Provider value={{ testimonial }}>
        <div className="flex flex-col gap-8">
          <Item variant="muted">
            <ItemMedia variant="icon">
              <TimerIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Recently Submitted Testimonial</ItemTitle>
              <ItemDescription>
                You can view this testimonial until{" "}
                {format(expirationDate, "PPp")}
              </ItemDescription>
            </ItemContent>
          </Item>
          {testimonial.processingStatus === "error" && (
            <TestimonialProcessingError />
          )}
          <TestimonialTitle />
          {testimonial.mediaUrl && (
            <TestimonialMedia mediaUrl={testimonial.mediaUrl} />
          )}
          <TestimonialInfo />
          <TestimonialSummary />
          <TestimonialText />
        </div>
      </TestimonialContext.Provider>
    </div>
  );
}
