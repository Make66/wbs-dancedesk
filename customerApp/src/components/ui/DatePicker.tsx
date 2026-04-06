import { de } from "date-fns/locale";

import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  children?: React.ReactNode;
};

export function DatePicker({ value, onChange, children }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-auto rounded-2xl p-0 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={de}
          className="rounded-2xl"
          captionLayout="dropdown"
          fromYear={2020}
          toYear={2035}
        />
      </PopoverContent>
    </Popover>
  );
}
