import { usePaginatedQuery, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { TestimonialCard } from "./testimonial-card";
import { Spinner } from "./ui/spinner";

type Props = {
  search: string;
};

export function Testimonials({ search }: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const canApprove = useQuery(api.auth.checkUserPermissions, {
    permissions: {
      testimonial: ["approve"],
    },
  });

  const searchQuery = search.trim();

  const { results, status, loadMore } = usePaginatedQuery(
    api.testimonials.getTestimonials,
    { searchQuery: searchQuery ? searchQuery : undefined },
    { initialNumItems: 5 },
  );

  const sortedResults = results
    ? [...results].sort(
        (a, b) =>
          (b._creationTime ?? b._creationTime ?? 0) -
          (a._creationTime ?? a._creationTime ?? 0),
      )
    : results;

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

  return (
    <>
      {sortedResults?.map((testimonial) => (
        <TestimonialCard
          key={testimonial._id}
          testimonial={testimonial}
          showApprovalStatus={canApprove}
        />
      ))}

      <div className="w-full text-center">
        {status !== "Exhausted" ? (
          <Spinner className="size-12 mx-auto" />
        ) : (
          "End of results"
        )}
      </div>
      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}
