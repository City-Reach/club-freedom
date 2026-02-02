import type { ComponentProps } from "react";
import { Input } from "../ui/input";
import { useTestimonialSearchQuery } from "./hook";

export default function TestimonialSearchInput(
  props: ComponentProps<typeof Input>,
) {
  const { liveSearchQuery, setSearchQuery } = useTestimonialSearchQuery();
  return (
    <Input
      value={liveSearchQuery.q}
      placeholder="Search testimonials"
      onChange={(e) => {
        setSearchQuery({ q: e.target.value });
      }}
      {...props}
    />
  );
}
