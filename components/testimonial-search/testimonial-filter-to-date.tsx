import { ChevronDown, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
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

export default function TestimonialFilterToDate() {
  const [filter, setFilter] = useTestimonialFilter();
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup>
      {filter.to ? (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setFilter({
              to: null,
            })
          }
        >
          <XIcon /> To Date
        </Button>
      ) : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn({
              "border-dashed": !filter.to,
              "text-primary": filter.to,
            })}
            size="sm"
          >
            {filter.to ? (
              <>
                {formatDate(filter.to)}
                <ChevronDown />
              </>
            ) : (
              <>
                <PlusIcon /> To Date
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <TestimonialDateInput
            date={filter.to || undefined}
            enabledDate={(date) =>
              date.getTime() <= Date.now() &&
              date.getTime() >= Math.max(filter.from?.getTime() || 0)
            }
            onDateChange={(date) => {
              setFilter({ to: date });
              setOpen(false);
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
