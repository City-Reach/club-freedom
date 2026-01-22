import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  date: Date | null;
  onDateChange: (date: Date) => void;
  enabledDate: (date: Date) => boolean;
};

export default function DateInput({ date, onDateChange, enabledDate }: Props) {
  const [month, setMonth] = useState<Date | undefined>(date || undefined);

  return (
    <Calendar
      mode="single"
      timeZone="UTC"
      captionLayout="dropdown"
      selected={date || undefined}
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
