import { format, setHours, setMinutes } from "date-fns";
import { settingsStore } from "../../../stores/settingsStore";

export function TimeGutter() {
  const calendar = settingsStore((state) => state.settings.calendar);
  const slotsPerHour = settingsStore((state) => state.getSlotsPerHour)();

  const hours = Array.from(
    { length: calendar.endHour - calendar.startHour },
    (_, i) => i + calendar.startHour,
  );

  return (
    <div className="relative border-r bg-background rounded-bl-3xl">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative px-3"
          style={{ height: `${calendar.slotHeight * slotsPerHour}px` }}
        >
          <span className="absolute -top-2 right-4 text-xs text-muted-foreground">
            {format(setMinutes(setHours(new Date(), hour), 0), "HH:mm")}
          </span>
        </div>
      ))}
    </div>
  );
}
