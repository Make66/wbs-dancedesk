import { WeekDayColumn } from "./WeekDayColumn";
import { TimeGutter } from "../core/TimeGutter";
import type { CalendarItem, CalendarItemResizeEndPayload } from "../../../types/calendar-types";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  days: Date[];
  items: CalendarItem[];
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function WeekGrid({ days, items, onEventResizeEnd }: Props) {
  const config = calendarStore((s) => s.config);

  return (
    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
      <TimeGutter config={config} />

      {days.map((day) => (
        <WeekDayColumn
          key={day.toISOString()}
          day={day}
          items={items}
          onEventResizeEnd={onEventResizeEnd}
        />
      ))}
    </div>
  );
}
