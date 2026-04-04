import { WeekDayColumn } from "./WeekDayColumn";
import { TimeGutter } from "../core/TimeGutter";
import type { CalendarEvent, CalendarEventResizeEndPayload } from "../../../types/calendar-types";
import { calendarStore } from "../../../stores/calendarStore";

type WeekGridProps = {
  days: Date[];
  events: CalendarEvent[];
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function WeekGrid({ days, events, onEventResizeEnd }: WeekGridProps) {
  const config = calendarStore((state) => state.config);

  return (
    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
      <TimeGutter config={config} />

      {days.map((day) => (
        <WeekDayColumn
          key={day.toISOString()}
          day={day}
          events={events}
          onEventResizeEnd={onEventResizeEnd}
        />
      ))}
    </div>
  );
}
