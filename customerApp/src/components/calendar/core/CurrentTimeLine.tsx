import type { CalendarConfig } from "../../../types/calendar-types";
import { getMinutesSinceStartOfDay, isSameDay } from "../../../lib/calendar/date-utils";

type CurrentTimeLineProps = {
  day: Date;
  slotHeight: number;
  config: CalendarConfig;
};

export function CurrentTimeLine({ day, slotHeight, config }: CurrentTimeLineProps) {
  const now = new Date();

  if (!isSameDay(now, day)) return null;

  const currentMinutes = getMinutesSinceStartOfDay(now);
  const visibleStartMinutes = config.startHour * 60;
  const visibleEndMinutes = config.endHour * 60;

  if (currentMinutes < visibleStartMinutes || currentMinutes > visibleEndMinutes) {
    return null;
  }

  const relativeMinutes = currentMinutes - visibleStartMinutes;
  const top = (relativeMinutes / config.minutesPerSlot) * slotHeight;

  return (
    <div className="pointer-events-none absolute left-0 right-0 z-20" style={{ top: `${top}px` }}>
      <div className="absolute -left-1.5 top-[-4px] h-2.5 w-2.5 rounded-full bg-red-500" />
      <div className="h-0.5 w-full bg-red-500" />
    </div>
  );
}
