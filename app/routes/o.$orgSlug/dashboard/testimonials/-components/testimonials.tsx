import { useRouteContext } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import TestimonialCardInfo from "@/components/testimonial-card/testimonial-card-info";
import TestimonialCardText from "@/components/testimonial-card/testimonial-card-text";
import TestimonialCardTitle from "@/components/testimonial-card/testimonial-card-title";
import TestimonialApproval from "@/components/testimonial-detail/testimonial-approval";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TestimonialContext } from "@/contexts/testimonial-context";
import { useInfiniteTestimonialQuery } from "@/lib/query";
import { Route as TestimonialsRoute } from "../index";
import TestimonialCardFormat from "./testimonial-card-format";
import TestimonialCardShell from "./testimonial-card-shell";

export default function Testimonials() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const query = TestimonialsRoute.useSearch();

  const { results, loadMore, status, isLoading } = useInfiniteTestimonialQuery(
    organization._id,
    query,
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
    <div className="grid gap-4">
      {results.map((testimonial) => (
        <TestimonialContext.Provider
          key={testimonial._id}
          value={{ testimonial }}
        >
          <TestimonialCardShell>
            <CardHeader>
              <div className="flex justify-between">
                <TestimonialCardTitle />
                <TestimonialCardFormat />
              </div>
              <TestimonialCardInfo />
            </CardHeader>
            <CardContent>
              <TestimonialCardText />
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
