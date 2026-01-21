import { ChevronDown, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  getTestimonialTypeLabel,
  testimonialTypes,
  useTestimonialFilter,
} from "./schema";

export default function TestimonialFormatFilter() {
  const [filter, setFilter] = useTestimonialFilter();
  const hasTestimonialType = filter.testimonialTypes.length > 0;

  return (
    <ButtonGroup>
      {hasTestimonialType ? (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setFilter({
              testimonialTypes: [],
            })
          }
        >
          <XIcon /> Format
        </Button>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn({
              "border-dashed": !hasTestimonialType,
              "text-primary": hasTestimonialType,
            })}
            size="sm"
          >
            {hasTestimonialType ? (
              <>
                {filter.testimonialTypes
                  .map(getTestimonialTypeLabel)
                  .join(", ")}
                <ChevronDown />
              </>
            ) : (
              <>
                <PlusIcon /> Format
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {testimonialTypes.map((format) => (
              <DropdownMenuCheckboxItem
                key={format}
                checked={filter.testimonialTypes.includes(format)}
                onCheckedChange={(checked) =>
                  setFilter((filter) => ({
                    ...filter,
                    testimonialTypes: checked
                      ? [...filter.testimonialTypes, format]
                      : filter.testimonialTypes.filter((t) => t !== format),
                  }))
                }
              >
                {getTestimonialTypeLabel(format)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
