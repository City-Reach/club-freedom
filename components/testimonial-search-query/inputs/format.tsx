import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  getTestimonialFormatLabel,
  testimonialFormats,
  useTestimonialSearchQuery,
} from "../schema";

export default function FormatInput() {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();

  return (
    <div className="grid gap-4 min-w-32">
      {testimonialFormats.map((format) => (
        <Field orientation="horizontal" key={format}>
          <Checkbox
            id={`checkbox-${format}`}
            name={format}
            checked={searchQuery.formats.includes(format)}
            onCheckedChange={(checked) =>
              setSearchQuery((filter) => ({
                ...filter,
                formats: checked
                  ? [...filter.formats, format]
                  : filter.formats.filter((t) => t !== format),
              }))
            }
          />
          <Label htmlFor={`checkbox-${format}`} className="flex-1">
            {getTestimonialFormatLabel(format)}
          </Label>
        </Field>
      ))}
    </div>
  );
}
