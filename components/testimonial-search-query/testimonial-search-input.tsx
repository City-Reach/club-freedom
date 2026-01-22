import type { ComponentProps } from "react";
import { Input } from "../ui/input";
import { useTestimonialSearchQuery } from "./schema";

export default function TestimonialSearchInput(
  props: ComponentProps<typeof Input>,
) {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();
  return (
    <Input
      value={searchQuery.q}
      placeholder="Search testimonials"
      onChange={(e) => {
        setSearchQuery({ q: e.target.value });
      }}
      {...props}
    />
  );
}
