import { format } from "date-fns";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CalendarDragData, PositionedCalendarEvent } from "../../../types/calendar-types";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  positionedEvent: PositionedCalendarEvent;
  isSelected: boolean;
  onClick: () => void;
  onResizeMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
};

export function WeekEventCard({ positionedEvent, isSelected, onClick, onResizeMouseDown }: Props) {
  const { event, top, height, left, width } = positionedEvent;
  const activeDragEventId = calendarStore((s) => s.activeDragEventId);

  const dragData: CalendarDragData = {
    type: "calendar-event",
    eventId: event.id,
    start: event.start,
    end: event.end,
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: dragData,
  });

  const isOverlaySource = activeDragEventId === event.id;

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      {...listeners}
      {...attributes}
      className={`absolute rounded-xl border px-3 py-2 text-left shadow-sm ${
        isSelected ? "border-zinc-900 bg-zinc-100" : "border-zinc-200 bg-zinc-50"
      }`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${left}% + 4px)`,
        width: `calc(${width}% - 8px)`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging || isOverlaySource ? 0.3 : 1,
      }}
    >
      <p className="text-sm font-semibold">{event.title}</p>
      <p className="text-xs text-zinc-500">
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </p>

      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeMouseDown(e);
        }}
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize"
      />
    </button>
  );
}
