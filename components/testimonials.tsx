"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
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

  const testimonials = useQuery(api.testimonials.getTestimonials, { searchQuery: debouncedQuery });
  return (
    <>
      <Input
        placeholder="Search testimonials..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {testimonials?.map((testimonial) => (
        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
      ))}
    </>
  );
}
