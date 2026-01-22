import { ChevronDown, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTestimonialFilter } from "./schema";
import TestimonialDateInput, { formatDate } from "./testimonial-date-input";
import { useState } from "react";

export default function TestimonialFilterFromDate() {
  const [filter, setFilter] = useTestimonialFilter();
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup>
      {filter.from ? (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setFilter({
              from: null,
            })
          }
        >
          <XIcon /> From Date
        </Button>
      ) : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn({
              "border-dashed": !filter.from,
              "text-primary": filter.from,
            })}
            size="sm"
          >
            {filter.from ? (
              <>
                {formatDate(filter.from)}
                <ChevronDown />
              </>
            ) : (
              <>
                <PlusIcon /> From Date
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <TestimonialDateInput
            date={filter.from || undefined}
            enabledDate={(date) =>
              date.getTime() <=
              Math.min(Date.now(), filter.to?.getTime() || Infinity)
            }
            onDateChange={(date) => {
              setFilter({ from: date });
              setOpen(false);
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
