import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "../../../lib/utils";

type WeekHeaderProps = {
  days: Date[];
};

export function WeekHeader({ days }: WeekHeaderProps) {
  return (
    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] bg-background">
      <div className="border-r px-3 py-4" />

      {days.map((day) => {
        const today = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              today && "bg-foreground/50 text-background rounded-b-2xl",
              "flex items-center justify-center gap-1 border-r px-2 py-3 last:border-r-0",
            )}
          >
            <span
              className={cn(
                "text-xs tracking-wide text-muted-foreground",
                today && "text-background",
              )}
            >
              {format(day, "EEE", { locale: de })}
            </span>

            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-xs text-muted-foreground",
                today && "text-background",
              )}
            >
              {format(day, "d", { locale: de })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
