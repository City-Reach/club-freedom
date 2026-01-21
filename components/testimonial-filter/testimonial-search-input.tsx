import type { ComponentProps } from "react";
import { Input } from "../ui/input";
import { useTestimonialFilter } from "./schema";

export default function TestimonialSearchInput(
  props: ComponentProps<typeof Input>,
) {
  const [search, setSearch] = useTestimonialFilter();
  return (
    <Input
      value={search.q}
      placeholder="Search testimonials"
      onChange={(e) => {
        setSearch((search) => ({
          ...search,
          q: e.target.value,
        }));
      }}
      {...props}
    />
  );
}
