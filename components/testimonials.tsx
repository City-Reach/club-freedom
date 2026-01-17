import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import { useInView } from "react-intersection-observer";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { api } from "@/convex/_generated/api";
import { hasPermissionQuery } from "@/lib/query";
import TestimonialCardApproval from "./testimonial-card/testimonial-card-approval";
import TestimonialCardInfo from "./testimonial-card/testimonial-card-info";
import TestimonialCardMedia from "./testimonial-card/testimonial-card-media";
import TestimonialCardShell from "./testimonial-card/testimonial-card-shell";
import TestimonialCardSummary from "./testimonial-card/testimonial-card-summary";
import TestimonialCardText from "./testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "./testimonial-card/testimonial-card-title";
import { CardContent, CardHeader } from "./ui/card";
import { Spinner } from "./ui/spinner";

type Props = {
  search: string;
};

export function Testimonials({ search }: Props) {
  const searchQuery = search.trim();
  const { results, status, loadMore } = usePaginatedQuery(
    api.testimonials.getTestimonials,
    {
      searchQuery: searchQuery ? searchQuery : undefined,
    },
    { initialNumItems: 10 },
  );

  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );

  const { ref } = useInView({
    rootMargin: "400px",
    onChange: (inView) => {
      if (results.length && inView && status === "CanLoadMore") {
        console.log("Loading more testimonials...", Date.now());
        loadMore(5);
      }
    },
  });

  return (
    <>
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
        {status === "Exhausted" ? (
          <div className="text-center text-sm text-muted-foreground">
            No more testimonials to load.
          </div>
        ) : (
          <Spinner className="size-8 mx-auto" />
        )}
      </div>
    </>
  );
}
