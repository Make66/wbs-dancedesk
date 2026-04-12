import { useMemo } from "react";
import { WeekGrid } from "./WeekGrid";
import { WeekHeader } from "./WeekHeader";
import type { CalendarItem, CalendarItemResizeEndPayload } from "../../../types/calendar-types";
import { getWeekDays } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  items: CalendarItem[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function CalendarWeekView({ items, onEventResizeEnd }: Props) {
  const currentDate = calendarStore((s) => s.currentDate);
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <>
      <WeekHeader days={days} />
      <WeekGrid days={days} items={items} onEventResizeEnd={onEventResizeEnd} />
    </>
  );
}
