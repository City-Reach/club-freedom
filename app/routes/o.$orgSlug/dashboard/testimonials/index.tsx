import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { testimonialSearchQuerySchema } from "@/components/testimonial-search-query/schema";
import TestimonialSearchInput from "@/components/testimonial-search-query/testimonial-search-input";
import TestimonialFilters from "@/components/testimonial-search-query/testimonial-search-queries";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTestimonialIdParam } from "./-components/hook";
import LoadingTestimonial from "./-components/loading-testimonial";
import TestimonialDetail from "./-components/testimonial-detail";
import Testimonials from "./-components/testimonials";

export const Route = createFileRoute("/o/$orgSlug/dashboard/testimonials/")({
  component: TestimonialsPage,
  validateSearch: testimonialSearchQuerySchema,
});

function TestimonialsPage() {
  const { testimonialId, setTestimonialId } = useTestimonialIdParam();

  return (
    // Note that the sidebar header is already set to fixed height, which is 4rem
    <div className="flex h-[calc(100vh-4rem)]">
      <ScrollArea
        className={cn(
          "flex flex-col h-full relative w-full @4xl/dashboard:w-120",
          testimonialId && "hidden @4xl/dashboard:block",
        )}
      >
        <div className="p-4 border-b border-border sticky top-0 z-10 bg-background flex flex-col">
          <TestimonialSearchInput />
          <TestimonialFilters />
        </div>
        <div className="p-4">
          <Testimonials />
        </div>
      </ScrollArea>
      {testimonialId ? (
        <ScrollArea className="flex-1 h-full @4xl/dashboard:border-border @4xl/dashboard:border-l">
          <div className="p-4 @4xl/dashboard:pt-8 flex flex-col gap-8 max-w-xl mx-auto">
            <Button
              variant="outline"
              className="cursor-pointer @4xl/dashboard:hidden self-start"
              onClick={() => setTestimonialId(null)}
            >
              <ChevronLeft />
              All testimonials
            </Button>
            <Suspense fallback={<LoadingTestimonial />}>
              <TestimonialDetail testimonialId={testimonialId} />
            </Suspense>
          </div>
        </ScrollArea>
      ) : (
        <Empty className="hidden @4xl/dashboard:block flex-col flex-1 h-full bg-muted rounded-none">
          <EmptyDescription>Select a testimonial to view</EmptyDescription>
        </Empty>
      )}
    </div>
  );
}
