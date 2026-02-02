import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useTestimonialSearchQuery } from "../hook";
import { getTestimonialStatusLabel, testimonialStatuses } from "../schema";

export default function StatusInput() {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();

  return (
    <div className="grid gap-4 min-w-32">
      {testimonialStatuses.map((status) => (
        <Field orientation="horizontal" key={status}>
          <Checkbox
            id={`checkbox-${status}`}
            name={status}
            checked={searchQuery.statuses.includes(status)}
            onCheckedChange={(checked) =>
              setSearchQuery((filter) => ({
                ...filter,
                statuses: checked
                  ? [...filter.statuses, status]
                  : filter.statuses.filter((t) => t !== status),
              }))
            }
          />
          <Label htmlFor={`checkbox-${status}`} className="flex-1">
            {getTestimonialStatusLabel(status)}
          </Label>
        </Field>
      ))}
    </div>
  );
}
