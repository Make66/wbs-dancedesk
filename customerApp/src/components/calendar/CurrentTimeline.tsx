import { MINUTES_PER_SLOT, START_HOUR, END_HOUR } from "../../lib/constants/calendar-constants";
import { getMinutesSinceStartOfDay, isSameDay } from "../../lib/calendar/date-utils";

type CurrentTimeLineProps = {
  day: Date;
  slotHeight: number;
};

export function CurrentTimeLine({ day, slotHeight }: CurrentTimeLineProps) {
  const now = new Date();

  if (!isSameDay(now, day)) return null;

  const currentMinutes = getMinutesSinceStartOfDay(now);
  const visibleStart = START_HOUR * 60;
  const visibleEnd = END_HOUR * 60;

  if (currentMinutes < visibleStart || currentMinutes > visibleEnd) {
    return null;
  }

  const relativeMinutes = currentMinutes - visibleStart;
  const top = (relativeMinutes / MINUTES_PER_SLOT) * slotHeight;

  return (
    <div className="pointer-events-none absolute left-0 right-0 z-20" style={{ top: `${top}px` }}>
      <div className="absolute -left-1.5 top-[-4px] h-2.5 w-2.5 rounded-full bg-red-500" />
      <div className="h-0.5 w-full bg-red-500" />
    </div>
  );
}
