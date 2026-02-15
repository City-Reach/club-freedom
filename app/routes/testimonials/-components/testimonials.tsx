import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TestimonialCardApproval from "@/components/testimonial-card/testimonial-card-approval";
import TestimonialCardInfo from "@/components/testimonial-card/testimonial-card-info";
import TestimonialCardMedia from "@/components/testimonial-card/testimonial-card-media";
import TestimonialCardShell from "@/components/testimonial-card/testimonial-card-shell";
import TestimonialCardSummary from "@/components/testimonial-card/testimonial-card-summary";
import TestimonialCardText from "@/components/testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "@/components/testimonial-card/testimonial-card-title";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { hasPermissionQuery, useInfiniteTestimonialQuery } from "@/lib/query";

export default function Testimonials() {
  const query = useSearch({
    from: "/testimonials/",
  });

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
