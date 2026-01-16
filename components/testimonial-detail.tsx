import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { hasPermissionQuery } from "@/lib/query";
import TestimonialApproval from "./testimonial-detail/testimonial-approval";
import TestimonialDownload from "./testimonial-detail/testimonial-download";
import TestimonialInfo from "./testimonial-detail/testimonial-info";
import TestimonialMedia from "./testimonial-detail/testimonial-media";
import TestimonialProcessingError from "./testimonial-detail/testimonial-processing-error";
import TestimonialSummary from "./testimonial-detail/testimonial-summary";
import TestimonialText from "./testimonial-detail/testimonial-text";
import { TestimonialTitle } from "./testimonial-detail/testimonial-title";

type Props = {
  id: Id<"testimonials">;
};

export default function TestimonialDetail({ id }: Props) {
  const { data: testimonial } = useSuspenseQuery(
    convexQuery(api.testimonials.getTestimonialById, {
      id: id as Id<"testimonials">,
    }),
  );

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
          {canDownload && <TestimonialDownload />}
        </div>
        <TestimonialInfo />
        <TestimonialSummary />
        <TestimonialText />
      </div>
    </TestimonialContext.Provider>
  );
}
