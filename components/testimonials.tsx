import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
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
  const { data: canApprove } = useSuspenseQuery(
    hasPermissionQuery({
      testimonial: ["approve"],
    }),
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const searchQuery = search.trim();

  const { results, status, loadMore } = usePaginatedQuery(
    api.testimonials.getTestimonials,
    { searchQuery: searchQuery ? searchQuery : undefined },
    { initialNumItems: 5 },
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(5);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [status, loadMore]);

  const TestimonialList = () =>
    results.map((testimonial) => (
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
    ));

  return (
    <>
      <TestimonialList />
      <div className="w-full text-center">
        {status !== "Exhausted" ? (
          <Spinner className="size-12 mx-auto" />
        ) : (
          "End of results"
        )}
        <div ref={loadMoreRef} className="h-10" />
      </div>
    </>
  );
}
