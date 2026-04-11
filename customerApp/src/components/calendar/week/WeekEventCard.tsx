import { useDraggable } from "@dnd-kit/core";
import { calendarStore } from "../../../stores/calendarStore";
import type { PositionedCalendarEvent } from "../../../types/calendar-types";

type Props = {
  positionedEvent: PositionedCalendarEvent;
  isSelected: boolean;
  onClick: () => void;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function WeekEventCard({ positionedEvent, isSelected, onClick, onResizeMouseDown }: Props) {
  const { event, top, height, left, width } = positionedEvent;
  const isEditMode = calendarStore((state) => state.isEditMode);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: {
      type: "calendar-event",
      eventId: event.id,
      start: event.start,
      end: event.end,
    },
    disabled: !isEditMode,
  });

  return (
    <div
      ref={setNodeRef}
      {...(isEditMode ? listeners : {})}
      {...(isEditMode ? attributes : {})}
      onClick={() => {
        if (!isEditMode) {
          onClick();
        }
      }}
      className={`absolute rounded-lg border shadow-sm cursor-pointer hover:saturate-200 opacity-70 ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        top,
        height,
        left: `${left}%`,
        width: `${width}%`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? "none" : "all 120ms ease",
        zIndex: isDragging ? 50 : 1,
        backgroundColor: event.color?.[0] || "#3B8200",
        color: event.color?.[1] || "#FFFFFF",
      }}
    >
      <div className="p-2 text-sm text-center font-medium">{event.title}</div>

      {isEditMode && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
        />
      )}
    </div>
  );
}
