import { XIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { getTestimonialTypeLabel, useTestimonialFilter } from "./schema";
import { formatDate } from "./testimonial-date-input";

export default function TestimonialFilterChips() {
  const [filter, setFilter] = useTestimonialFilter();

  const filterIsActive =
    filter.author ||
    filter.testimonialTypes.length > 0 ||
    filter.to ||
    filter.from;

  if (!filterIsActive) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Filters</div>
        <Button
          variant="link"
          size="sm"
          className="px-0 cursor-pointer"
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
      <div className="flex flex-wrap gap-2">
        {filter.author ? (
          <FilterBadge
            label={`Author: ${filter.author}`}
            onReset={() => setFilter((filter) => ({ ...filter, author: null }))}
          />
        ) : null}
        {filter.testimonialTypes.map((type) => (
          <FilterBadge
            key={type}
            label={getTestimonialTypeLabel(type)}
            onReset={() =>
              setFilter((filter) => ({
                ...filter,
                testimonialTypes: filter.testimonialTypes.filter(
                  (t) => t !== type,
                ),
              }))
            }
          />
        ))}
        {filter.to ? (
          <FilterBadge
            label={`To ${formatDate(filter.to)}`}
            onReset={() => setFilter((filter) => ({ ...filter, to: null }))}
          />
        ) : null}
        {filter.from ? (
          <FilterBadge
            label={`From ${formatDate(filter.from)}`}
            onReset={() => setFilter((filter) => ({ ...filter, from: null }))}
          />
        ) : null}
      </div>
    </div>
  );
}

type FilterBadgeProps = {
  label: string;
  onReset?: () => void;
};

function FilterBadge({ label, onReset }: FilterBadgeProps) {
  return (
    <Badge className="px-3 py-1">
      {label}
      <button
        type="button"
        className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        aria-label="Close"
        onClick={onReset}
      >
        <XIcon className="size-3" aria-hidden="true" />
      </button>
    </Badge>
  );
}
