import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import {
  getTestimonialFormatLabel,
  testimonialFormats,
  useTestimonialSearchQuery,
} from "../schema";

export default function FormatInput() {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();
  return testimonialFormats.map((format) => (
    <DropdownMenuCheckboxItem
      key={format}
      checked={searchQuery.formats.includes(format)}
      onSelect={(e) => e.preventDefault()}
      onCheckedChange={(checked) =>
        setSearchQuery((filter) => ({
          ...filter,
          formats: checked
            ? [...filter.formats, format]
            : filter.formats.filter((t) => t !== format),
        }))
      }
    >
      {getTestimonialFormatLabel(format)}
    </DropdownMenuCheckboxItem>
  ));
}
