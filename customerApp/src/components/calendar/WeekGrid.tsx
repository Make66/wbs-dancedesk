import { DayColumn } from "./DayColumn";
import { TimeGutter } from "./TimeGutter";
import type {
  CalendarEvent,
  DraftEvent,
  DragSelection,
  DraggedEventState,
  ResizingEventState,
  SelectedTimeRange,
} from "../../types/calendar-types";

type WeekGridProps = {
  days: Date[];
  events: CalendarEvent[];
  draftEvent: DraftEvent | null;
  slotHeight: number;
  selectedRange: SelectedTimeRange | null;
  dragSelection: DragSelection | null;
  draggedEvent: DraggedEventState | null;
  resizingEvent: ResizingEventState | null;
  selectedEventId: string | null;
  onSelectRange: (range: SelectedTimeRange) => void;
  onDragSelectionChange: (range: DragSelection | null) => void;
  onSelectEvent: (eventId: string) => void;
  onEventDragStart: (event: CalendarEvent, pointerOffsetY: number) => void;
  onEventDragChange: (start: Date, end: Date) => void;
  onEventDragEnd: () => void;
  onEventResizeStart: (event: CalendarEvent) => void;
  onEventResizeChange: (end: Date) => void;
  onEventResizeEnd: () => void;
};

export function WeekGrid({
  days,
  events,
  draftEvent,
  slotHeight,
  selectedRange,
  dragSelection,
  selectedEventId,
  onSelectRange,
  onDragSelectionChange,
  onSelectEvent,
  onEventDragStart,
  onEventDragChange,
  onEventDragEnd,
  draggedEvent,
  onEventResizeStart,
  onEventResizeChange,
  onEventResizeEnd,
  resizingEvent,
}: WeekGridProps) {
  return (
    <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
      <TimeGutter />

      {days.map((day) => (
        <DayColumn
          key={day.toISOString()}
          day={day}
          events={events}
          draftEvent={draftEvent}
          slotHeight={slotHeight}
          selectedRange={selectedRange}
          dragSelection={dragSelection}
          draggedEvent={draggedEvent}
          resizingEvent={resizingEvent}
          selectedEventId={selectedEventId}
          onSelectRange={onSelectRange}
          onDragSelectionChange={onDragSelectionChange}
          onSelectEvent={onSelectEvent}
          onEventDragStart={onEventDragStart}
          onEventDragChange={onEventDragChange}
          onEventDragEnd={onEventDragEnd}
          onEventResizeStart={onEventResizeStart}
          onEventResizeChange={onEventResizeChange}
          onEventResizeEnd={onEventResizeEnd}
        />
      ))}
    </div>
  );
}
