import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import {
  getTestimonialTypeLabel,
  testimonialTypes,
  useTestimonialFilter,
} from "../schema";

export default function FormatInput() {
  const [filter, setFilter] = useTestimonialFilter();
  return testimonialTypes.map((format) => (
    <DropdownMenuCheckboxItem
      key={format}
      checked={filter.formats.includes(format)}
      onSelect={(e) => e.preventDefault()}
      onCheckedChange={(checked) =>
        setFilter((filter) => ({
          ...filter,
          formats: checked
            ? [...filter.formats, format]
            : filter.formats.filter((t) => t !== format),
        }))
      }
    >
      {getTestimonialTypeLabel(format)}
    </DropdownMenuCheckboxItem>
  ));
}
