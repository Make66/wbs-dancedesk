import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { calendarStore } from "../../../stores/calendarStore";
import type { PositionedCalendarItem } from "../../../types/calendar-types";

type Props = {
  positionedItem: PositionedCalendarItem;
  isSelected: boolean;
  onClick: () => void;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function WeekEventCard({ positionedItem, isSelected, onClick, onResizeMouseDown }: Props) {
  const { item, top, height, left, width } = positionedItem;
  const isEditMode = calendarStore((state) => state.isEditMode);

  const isDraggable = isEditMode;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      type: "calendar-item",
      itemId: item.id,
      itemKind: item.kind,
      start: item.start,
      end: item.end,
    },
    disabled: !isDraggable,
  });

  const timeLabel = `${format(item.start, "HH:mm", { locale: de })} – ${format(item.end, "HH:mm", { locale: de })} Uhr`;
  const description = item.kind === "event" ? (item.description ?? "") : "";
  const location = item.kind === "event" ? [item.street, item.city].filter(Boolean).join(", ") : "";

  return (
    <div
      ref={setNodeRef}
      {...(isDraggable ? listeners : {})}
      {...(isDraggable ? attributes : {})}
      onClick={() => {
        if (!isEditMode) {
          onClick();
        }
      }}
      data-tooltip-id="calendar-item-tooltip"
      data-tooltip-hidden={isDragging}
      data-item-title={item.title}
      data-item-time={timeLabel}
      data-item-description={description}
      data-item-location={location}
      className={`absolute rounded-lg border shadow-sm cursor-pointer hover:saturate-200 ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        top,
        height,
        left: `${left}%`,
        width: `${width}%`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? "none" : "all 120ms ease",
        zIndex: isDragging ? 50 : 1,
        backgroundColor: item.color?.[0] || "#3B8200",
        color: item.color?.[1] || "#FFFFFF",
        opacity: item.courseId ? 0.9 : 1,
      }}
    >
      <div className="p-2 text-sm text-center font-medium">{item.courseId ? "" : item.title}</div>

      {isEditMode && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
        />
      )}
    </div>
  );
}
