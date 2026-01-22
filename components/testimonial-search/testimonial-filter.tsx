import { Button } from "../ui/button";
import { useTestimonialFilter } from "./schema";
import TestimonialFilterAuthor from "./testimonial-filter-author";
import TestimonialFilterFormat from "./testimonial-filter-format";
import TestimonialFilterFromDate from "./testimonial-filter-from-date";
import TestimonialFilterToDate from "./testimonial-filter-to-date";

export default function TestimonialFilterChips() {
  const [filter, setFilter] = useTestimonialFilter();

  const filterIsActive =
    filter.author ||
    filter.testimonialTypes.length > 0 ||
    filter.to ||
    filter.from;

  return (
    <div className="space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Filters</div>
        <Button
          variant="link"
          size="sm"
          className="px-0 cursor-pointer"
          disabled={!filterIsActive}
          onClick={() => {
            setFilter((filter) => ({
              q: filter.q,
              author: null,
              testimonialTypes: null,
              to: null,
              from: null,
            }));
          }}
        >
          Reset filter
        </Button>
      </div>
      {/* Filter buttons */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mb-2 w-full">
        <TestimonialFilterAuthor />
        <TestimonialFilterFormat />
        <TestimonialFilterFromDate />
        <TestimonialFilterToDate />
      </div>
    </div>
  );
}
