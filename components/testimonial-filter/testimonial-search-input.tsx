import { debounce, useQueryStates } from "nuqs";
import type { ComponentProps } from "react";
import { Input } from "../ui/input";
import { testimonialFilterSchema } from "./schema";

export default function TestimonialSearchInput(
  props: ComponentProps<typeof Input>,
) {
  const [search, setSearch] = useQueryStates(testimonialFilterSchema);
  return (
    <Input
      value={search.q}
      placeholder="Search testimonials"
      onChange={(e) => {
        setSearch(
          { q: e.target.value },
          {
            limitUrlUpdates: debounce(500),
          },
        );
      }}
      {...props}
    />
  );
}
