import { useMemo } from "react";
import { WeekGrid } from "./WeekGrid";
import { WeekHeader } from "./WeekHeader";
import type { CalendarEvent, CalendarEventResizeEndPayload } from "../../../types/calendar-types";
import { getWeekDays } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  events: CalendarEvent[];
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function CalendarWeekView({ events, onEventResizeEnd }: Props) {
  const currentDate = calendarStore((s) => s.currentDate);
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <>
      <WeekHeader days={days} />
      <WeekGrid days={days} events={events} onEventResizeEnd={onEventResizeEnd} />
    </>
  );
}
