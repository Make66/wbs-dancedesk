import { useMemo } from "react";
import { WeekGrid } from "./WeekGrid";
import { WeekHeader } from "./WeekHeader";
import type { CalendarItem, CalendarItemResizeEndPayload } from "../../../types/calendar-types";
import type { Room } from "../../../types/room-types";
import { getWeekDays } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  items: CalendarItem[];
  rooms?: Room[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function CalendarWeekView({ items, rooms, onEventResizeEnd }: Props) {
  const currentDate = calendarStore((s) => s.currentDate);
  const days = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <>
      <WeekHeader days={days} rooms={rooms} />
      <WeekGrid days={days} items={items} rooms={rooms} onEventResizeEnd={onEventResizeEnd} />
    </>
  );
}
