import { format, setHours, setMinutes } from "date-fns";
import { HOURS_PER_DAY, SLOT_HEIGHT, SLOTS_PER_HOUR } from "../../lib/constants/calendar-constants";

const HOURS = Array.from({ length: HOURS_PER_DAY }, (_, i) => i);

export function TimeGutter() {
  return (
    <div className="relative border-r bg-white">
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="relative px-3"
          style={{ height: `${SLOT_HEIGHT * SLOTS_PER_HOUR}px` }}
        >
          <span className="absolute -top-2 right-4 text-xs text-muted-foreground">
            {format(setMinutes(setHours(new Date(), hour), 0), "HH:mm")}
          </span>
        </div>
      ))}
    </div>
  );
}
