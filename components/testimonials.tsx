"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { TestimonialCard } from "./testimonial-card";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

export function Testimonials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { results, status, loadMore } = usePaginatedQuery(
    api.testimonials.getTestimonials, 
    { searchQuery: debouncedQuery }, 
    {initialNumItems: 5}
  );
  return (
    <>
      <Input
        placeholder="Search testimonials..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {results?.map((testimonial) => (
        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
      ))}
      <button onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Load More
      </button>
    </>
  );
}
