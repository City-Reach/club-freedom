import { useSuspenseQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { TestimonialContext } from "@/contexts/testimonial-context";
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

export function Testimonials() {
  const { searchQuery } = useTestimonialSearchQuery();
  const searchText = useDebounce(searchQuery.q, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteTestimonialQuery({
      ...searchQuery,
      q: searchText,
    });
  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );

  const { ref, inView } = useInView({
    rootMargin: "400px",
  });

  // Fetch next page if element is in view and hasNextPage becomes true
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...", Date.now());
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="grid gap-8">
      {data?.pages
        .flatMap((page) => page.page)
        .map((testimonial) => (
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
        {!hasNextPage && !isLoading ? (
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
