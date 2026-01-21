import { XIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { getTestimonialTypeLabel, useTestimonialFilter } from "./schema";
import { formatDate } from "./testimonial-date-input";

export default function TestimonialFilterChips() {
  const [filter, setFilter] = useTestimonialFilter();

  return (
    <div className="flex gap-2">
      {filter.author ? (
        <FilterBadge
          label={`Author: ${filter.author}`}
          onReset={() => setFilter((filter) => ({ ...filter, author: null }))}
        />
      ) : null}
      {filter.testimonialTypes?.length ? (
        <FilterBadge
          label={`Types: ${filter.testimonialTypes.map(getTestimonialTypeLabel).join(", ")}`}
          onReset={() =>
            setFilter((filter) => ({ ...filter, testimonialTypes: [] }))
          }
        />
      ) : null}
      {filter.before ? (
        <FilterBadge
          label={`Before: ${formatDate(filter.before)}`}
          onReset={() => setFilter((filter) => ({ ...filter, before: null }))}
        />
      ) : null}
      {filter.after ? (
        <FilterBadge
          label={`After: ${formatDate(filter.after)}`}
          onReset={() => setFilter((filter) => ({ ...filter, after: null }))}
        />
      ) : null}
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
