import { useState } from "react";
import { Calendar } from "../ui/calendar";

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

type Props = {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
  enabledDate: (date: Date) => boolean;
};

export default function TestimonialDateInput({
  date,
  onDateChange,
  enabledDate,
}: Props) {
  const [month, setMonth] = useState<Date | undefined>(date);

  return (
    <Calendar
      mode="single"
      timeZone="UTC"
      captionLayout="dropdown"
      selected={date}
      month={month}
      onMonthChange={setMonth}
      disabled={(date) => !enabledDate(date)}
      onSelect={(date) => {
        if (!date) {
          return;
        }
        onDateChange(date);
      }}
    />
  );
}
