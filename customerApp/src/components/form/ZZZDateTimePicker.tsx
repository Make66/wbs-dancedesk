import * as React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Clock3 } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type DateTimePickerProps = {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
};

function mergeDateAndTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return next;
}

function getTimeString(date?: Date) {
  if (!date) return "09:00";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Datum und Uhrzeit wählen",
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState<string>(getTimeString(value));

  React.useEffect(() => {
    setSelectedDate(value);
    setTime(getTimeString(value));
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!date) {
      onChange?.(undefined);
      return;
    }

    onChange?.(mergeDateAndTime(date, time));
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTime(newTime);

    if (!selectedDate) return;
    onChange?.(mergeDateAndTime(selectedDate, newTime));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[320px] justify-start rounded-xl text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd.MM.yyyy HH:mm", { locale: de }) : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto rounded-2xl p-0">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={de}
            initialFocus
            captionLayout="dropdown"
            fromYear={2024}
            toYear={2035}
          />

          <div className="mt-3 flex items-center gap-2 border-t pt-3">
            <Clock3 className="h-4 w-4 text-muted-foreground" />
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="rounded-md border px-3 py-2 text-sm outline-none focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
