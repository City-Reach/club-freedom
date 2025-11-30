"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { TestimonialCard } from "./testimonial-card";
import { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";

export function Testimonials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const canApprove = useQuery(api.auth.checkUserPermissions, {
    permissions: {
      testimonial: ["approve"],
    },
  });

  const { results, status, loadMore } = usePaginatedQuery(
    api.testimonials.getTestimonials,
    { searchQuery: debouncedQuery },
    { initialNumItems: 5 },
  );

  const sortedResults = results
    ? [...results].sort(
        (a, b) =>
          (b._creationTime ?? b.createdAt ?? 0) -
          (a._creationTime ?? a.createdAt ?? 0),
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
      <Input
        placeholder="Search testimonials..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {sortedResults?.map((testimonial) => (
        <TestimonialCard
          key={testimonial._id}
          testimonial={testimonial}
          showApprovalStatus={canApprove}
        />
      ))}
      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}
