import { format, setHours, setMinutes } from "date-fns";
import type { CalendarConfig } from "../../../types/calendar-types";
import { getSlotsPerHour } from "../../../lib/constants/calendar-constants";

type TimeGutterProps = {
  config: CalendarConfig;
};

export function TimeGutter({ config }: TimeGutterProps) {
  const slotsPerHour = getSlotsPerHour(config);
  const hours = Array.from(
    { length: config.endHour - config.startHour },
    (_, i) => i + config.startHour,
  );

  return (
    <div className="relative border-r bg-background rounded-bl-3xl">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative px-3"
          style={{ height: `${config.slotHeight * slotsPerHour}px` }}
        >
          <span className="absolute -top-2 right-4 text-xs text-muted-foreground">
            {format(setMinutes(setHours(new Date(), hour), 0), "HH:mm")}
          </span>
        </div>
      ))}
    </div>
  );
}
