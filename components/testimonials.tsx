import { useSuspenseQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TestimonialContext } from "@/contexts/testimonial-context";
import type { Id } from "@/convex/betterAuth/_generated/dataModel";
import { hasPermissionQuery, useInfiniteTestimonialQuery } from "@/lib/query";
import TestimonialCardApproval from "./testimonial-card/testimonial-card-approval";
import TestimonialCardInfo from "./testimonial-card/testimonial-card-info";
import TestimonialCardMedia from "./testimonial-card/testimonial-card-media";
import TestimonialCardShell from "./testimonial-card/testimonial-card-shell";
import TestimonialCardSummary from "./testimonial-card/testimonial-card-summary";
import TestimonialCardText from "./testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "./testimonial-card/testimonial-card-title";
import { useTestimonialSearchQuery } from "./testimonial-search-query/hook";
import { CardContent, CardHeader } from "./ui/card";
import { Spinner } from "./ui/spinner";

type Props = {
  orgId: Id<"organization">;
};

export function Testimonials({ orgId }: Props) {
  const { searchQuery } = useTestimonialSearchQuery();
  const searchText = useDebounce(searchQuery.q, 500);

  const { results, loadMore, status, isLoading } = useInfiniteTestimonialQuery(
    orgId,
    {
      ...searchQuery,
      q: searchText,
    },
  );
  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery(
      {
        testimonial: ["approve"],
      },
      orgId,
    ),
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
