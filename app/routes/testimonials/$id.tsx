import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";
import TestimonialDownload from "@/components/testimonial-detail/testimonial-download";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialMetadata from "@/components/testimonial-detail/testimonial-metadata";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/testimonials/$id")({
  ssr: false,
  component: TestimonialDetailPage,
  loader: async () => {
    const { data } = await authClient.admin.hasPermission({
      permissions: {
        testimonial: ["approve"],
      },
    });

    const canApprove = data?.success || false;

    return { canApprove };
  },
});

function TestimonialDetailPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Authenticated>
        <Button variant="link" className="px-0!" asChild>
          <Link to="..">
            <ChevronLeft />
            Back
          </Link>
        </Button>
      </Authenticated>
      <Suspense fallback={<PendingTestimonialDetail />}>
        <TestimonialDetails />
      </Suspense>
    </div>
  );
}

function PendingTestimonialDetail() {
  return (
    <main className="max-w-xl mx-auto py-12 px-8 space-y-4">
      <Spinner className="size-8" />
      <span>Loading testimonial...</span>
    </main>
  );
}

function TestimonialDetails() {
  const { id } = Route.useParams();
  const { data: testimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialById, {
      id: id as Id<"testimonials">,
    }),
  );
  const { canApprove } = Route.useLoaderData();

  if (testimonial === null) {
    return (
      <main className="max-w-xl mx-auto py-12 px-8 space-y-4">
        <AlertCircle className="size-8" />
        <span>Not found</span>
      </main>
    );
  }

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
        <div className="flex gap-2">
          {canApprove && testimonial.processingStatus === "completed" && (
            <TestimonialApproval />
          )}
          <TestimonialDownload />
        </div>
        <TestimonialMetadata />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
