import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TestimonialCardApproval from "@/components/testimonial-card/testimonial-card-approval";
import TestimonialCardInfo from "@/components/testimonial-card/testimonial-card-info";
import TestimonialCardMedia from "@/components/testimonial-card/testimonial-card-media";
import TestimonialCardShell from "@/components/testimonial-card/testimonial-card-shell";
import TestimonialCardSummary from "@/components/testimonial-card/testimonial-card-summary";
import TestimonialCardText from "@/components/testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "@/components/testimonial-card/testimonial-card-title";
import { testimonialSearchQuerySchema } from "@/components/testimonial-search-query/schema";
import TestimonialSearchInput from "@/components/testimonial-search-query/testimonial-search-input";
import TestimonialFilters from "@/components/testimonial-search-query/testimonial-search-queries";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { hasPermissionQuery, useInfiniteTestimonialQuery } from "@/lib/query";

export const Route = createFileRoute("/testimonials/")({
  ssr: false,
  component: TestimonialsPage,
  validateSearch: testimonialSearchQuerySchema,
});

function TestimonialsPage() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            What Our Volunteers Say
          </h2>
          <p className="mx-auto max-w-175 text-muted-foreground md:text-xl text-balance">
            Don't just take our word for it. Here's what real volunteers have to
            say about their experience.
          </p>
        </div>
      </div>
      <div className="w-full grid gap-8 max-w-lg mx-auto mb-24 min-w-0">
        <div className="grid min-w-0">
          <TestimonialSearchInput />
          <TestimonialFilters />
        </div>
        <Testimonials />
      </div>
    </main>
  );
}

function Testimonials() {
  const query = Route.useSearch();
  const { results, loadMore, status, isLoading } =
    useInfiniteTestimonialQuery(query);

  const { data: canApprove } = useQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );

  const { ref, inView } = useInView({
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && status === "CanLoadMore" && !isLoading) {
      console.log("Fetching next page...", Date.now());
      loadMore(5);
    }
  }, [inView, loadMore, status, isLoading]);

  return (
    <div className="grid gap-8">
      {results.map((testimonial) => (
        <TestimonialContext.Provider
          key={testimonial._id}
          value={{ testimonial }}
        >
          <TestimonialCardShell>
            <CardHeader>
              <div className="flex justify-between">
                <TestimonialCardTitle />
                {canApprove && <TestimonialCardApproval />}
              </div>
              <TestimonialCardInfo />
            </CardHeader>
            <CardContent>
              {testimonial.mediaUrl ? (
                <div className="space-y-2">
                  <TestimonialCardMedia mediaUrl={testimonial.mediaUrl} />
                  <TestimonialCardSummary />
                </div>
              ) : (
                <TestimonialCardText />
              )}
            </CardContent>
          </TestimonialCardShell>
        </TestimonialContext.Provider>
      ))}
      <div ref={ref}>
        {status === "Exhausted" && !isLoading ? (
          <div className="text-center text-sm text-muted-foreground">
            No more testimonials to load.
          </div>
        ) : (
          <Spinner className="size-8 mx-auto" />
        )}
      </div>
    </div>
  );
}
