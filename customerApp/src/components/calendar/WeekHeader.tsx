import { format, isToday } from "date-fns";
import { de } from "date-fns/locale";

type WeekHeaderProps = {
  days: Date[];
};

export function WeekHeader({ days }: WeekHeaderProps) {
  return (
    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b bg-white">
      <div className="border-r px-3 py-4" />

      {days.map((day) => {
        const today = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className="flex items-center justify-center gap-1 border-r px-2 py-3 last:border-r-0"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {format(day, "EEE", { locale: de })}
            </span>

            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                today ? "bg-black text-white" : "text-foreground",
              ].join(" ")}
            >
              {format(day, "d", { locale: de })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
