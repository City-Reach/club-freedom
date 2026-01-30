import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTestimonialSearchQuery } from "../hook";
import { getSortOrderLabel, type SortOrder, sortOrders } from "../schema";

export default function SortOrderInput() {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();

  return (
    <RadioGroup
      className="grid gap-4 min-w-32"
      value={searchQuery.order}
      onValueChange={(value) =>
        setSearchQuery({
          order: value as SortOrder,
        })
      }
    >
      {sortOrders.map((order) => (
        <Field orientation="horizontal" key={order}>
          <RadioGroupItem id={`sort-${order}`} value={order} />
          <Label htmlFor={`sort-${order}`} className="flex-1">
            {getSortOrderLabel(order)}
          </Label>
        </Field>
      ))}
    </RadioGroup>
  );
}
