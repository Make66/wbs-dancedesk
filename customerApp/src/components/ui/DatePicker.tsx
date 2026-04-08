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
          className="w-full"
          classNames={{
            months: "flex flex-col gap-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-lg",
            nav_button: "h-15 w-15",
            table: "w-full border-collapse space-y-2",
            head_row: "flex",
            head_cell: "w-12 text-sm",
            row: "flex w-full mt-2",
            cell: "w-14 h-14 text-lg",
            day: "h-14 w-14 p-0 text-lg",
          }}
          captionLayout="dropdown"
          fromYear={2020}
          toYear={2035}
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={de}
        />
      </PopoverContent>
    </Popover>
  );
}
