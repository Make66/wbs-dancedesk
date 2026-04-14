import { DayHeader } from "./DayHeader";
import { DayGrid } from "./DayGrid";
import type { CalendarItem, CalendarItemResizeEndPayload } from "../../../types/calendar-types";
import type { Room } from "../../../types/room-types";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  items: CalendarItem[];
  rooms?: Room[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function CalendarDayView({ items, rooms, onEventResizeEnd }: Props) {
  const currentDate = calendarStore((s) => s.currentDate);

  return (
    <>
      <DayHeader day={currentDate} rooms={rooms} />
      <DayGrid day={currentDate} items={items} rooms={rooms} onEventResizeEnd={onEventResizeEnd} />
    </>
  );
}
