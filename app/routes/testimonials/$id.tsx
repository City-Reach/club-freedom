import test from "node:test";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ca } from "zod/v4/locales";
import NotFound from "@/components/not-found";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";
import TestimonialDelete from "@/components/testimonial-detail/testimonial-delete";
import TestimonialDownload from "@/components/testimonial-detail/testimonial-download";
import TestimonialInfo from "@/components/testimonial-detail/testimonial-info";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Button } from "@/components/ui/button";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { hasPermissionQuery } from "@/lib/query";

export const Route = createFileRoute("/testimonials/$id")({
  ssr: false,
  component: Component,
  notFoundComponent: NotFound,
  loader: async ({ context, params }) => {
    let testimonial = null;
    try {
      testimonial = await context.queryClient.ensureQueryData(
        convexQuery(api.testimonials.getTestimonialById, {
          id: params.id as Id<"testimonials">,
        }),
      );
    } catch (error) {
      throw notFound();
    }

    if (!testimonial) {
      throw notFound();
    }

    const canView = await context.queryClient.ensureQueryData(
      hasPermissionQuery({
        testimonial: ["view"],
      }),
    );

    if (!canView && !testimonial.approved) {
      throw notFound();
    }

    return { testimonial };
  },
});

function Component() {
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Button variant="link" className="px-0!" asChild>
        <Link to="..">
          <ChevronLeft />
          Back
        </Link>
      </Button>
      <TestimonialDetail />
    </div>
  );
}

export default function TestimonialDetail() {
  const { testimonial } = Route.useLoaderData();

  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );

  const { data: canDownload } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["download"],
    }),
  );

  const { data: canDelete } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["delete"],
    }),
  );

  return (
    <TestimonialContext.Provider value={{ testimonial }}>
      <div className="flex flex-col gap-8">
        {testimonial.processingStatus === "error" && (
          <TestimonialProcessingError />
        )}
        <TestimonialTitle />
        {testimonial.mediaUrl && (
          <TestimonialMedia mediaUrl={testimonial.mediaUrl} />
        )}
        <div className="flex flex-wrap gap-2">
          {canApprove && testimonial.processingStatus === "completed" && (
            <TestimonialApproval />
          )}
          {canDownload && <TestimonialDownload />}
          {canDelete && <TestimonialDelete />}
        </div>
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
