import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function formatDate(date: Date | undefined) {
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

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !Number.isNaN(date.getTime());
}

type Props = {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
};

export default function TestimonialDateInput({ date, onDateChange }: Props) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        placeholder="MM/DD/YYYY"
        onChange={(e) => {
          setValue(e.target.value);
          const date = new Date(e.target.value);
          if (isValidDate(date)) {
            console.log(date.toUTCString());
            setMonth(date);
            onDateChange(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <CalendarIcon />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              timeZone="UTC"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                if (!date) {
                  setOpen(false);
                  return;
                }
                onDateChange(date);
                setValue(formatDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
