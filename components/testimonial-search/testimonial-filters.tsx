import { Button } from "../ui/button";
import TestimonialSearchDropdown from "./base/testimonial-search-dropdown";
import AuthoutInput from "./inputs/author";
import DateInput from "./inputs/date";
import FormatInput from "./inputs/format";
import { getTestimonialTypeLabel, useTestimonialFilter } from "./schema";

export default function TestimonialFilters() {
  const [filter, setFilter] = useTestimonialFilter();

  const filterIsActive =
    filter.author || filter.formats.length > 0 || filter.to || filter.from;

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
              formats: null,
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
        <TestimonialSearchDropdown
          name="Author"
          displayValue={filter.author}
          isEnabled={filter.author !== ""}
          clear={() => setFilter({ author: "" })}
        >
          {({ setOpen }) => <AuthoutInput onSuccess={() => setOpen(false)} />}
        </TestimonialSearchDropdown>
        <TestimonialSearchDropdown
          name="Format"
          displayValue={filter.formats.map(getTestimonialTypeLabel).join(", ")}
          isEnabled={filter.formats.length > 0}
          clear={() => setFilter({ formats: [] })}
        >
          {() => <FormatInput />}
        </TestimonialSearchDropdown>
        <TestimonialSearchDropdown
          name="From Date"
          displayValue={formatDate(filter.from)}
          isEnabled={filter.from !== null}
          clear={() => setFilter({ from: null })}
        >
          {({ setOpen }) => (
            <DateInput
              date={filter.from}
              enabledDate={(date) =>
                date.getTime() <=
                Math.min(Date.now(), filter.to?.getTime() || Infinity)
              }
              onDateChange={(date) => {
                setFilter({ from: date });
                setOpen(false);
              }}
            />
          )}
        </TestimonialSearchDropdown>
        <TestimonialSearchDropdown
          name="To Date"
          displayValue={formatDate(filter.to)}
          isEnabled={filter.to !== null}
          clear={() => setFilter({ to: null })}
        >
          {({ setOpen }) => (
            <DateInput
              date={filter.to}
              enabledDate={(date) =>
                date.getTime() <= Date.now() &&
                date.getTime() >= Math.max(filter.from?.getTime() || 0)
              }
              onDateChange={(date) => {
                setFilter({ to: date });
                setOpen(false);
              }}
            />
          )}
        </TestimonialSearchDropdown>
      </div>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}
