import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated } from "convex/react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { TestimonialTitle } from "@/components/testimonial-detail/testimonial-title";
import { Spinner } from "@/components/ui/spinner";
import TestimonialProcessingError from "@/components/testimonial-detail/testimonial-processing-error";
import TestimonialMedia from "@/components/testimonial-detail/testimonial-media";
import TestimonialMetadata from "@/components/testimonial-detail/testimonial-metadata";
import TestimonialSummary from "@/components/testimonial-detail/testimonial-summary";
import TestimonialText from "@/components/testimonial-detail/testimonial-text";
import TestimonialMediaDownload from "@/components/testimonial-detail/testimonial-media-download";
import TestimonialTextDownload from "@/components/testimonial-detail/testimonial-text-download";
import { convexQuery } from "@convex-dev/react-query";
import { Suspense, use } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";

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
        {canApprove && testimonial.processingStatus === "completed" && (
          <TestimonialApproval />
        )}
        {testimonial.mediaUrl && (
          <TestimonialMedia mediaUrl={testimonial.mediaUrl} />
        )}
        <div className="flex gap-2">
          {testimonial.storageId && <TestimonialMediaDownload />}
          <TestimonialTextDownload />
        </div>
        <TestimonialMetadata />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
