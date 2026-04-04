import { format } from "date-fns";
import type { PositionedCalendarEvent } from "../../types/calendar-types";
import type React from "react";

type EventCardProps = {
  positionedEvent: PositionedCalendarEvent;
  isSelected: boolean;
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function EventCard({
  positionedEvent,
  isSelected,
  onClick,
  onMouseDown,
  onResizeMouseDown,
}: EventCardProps) {
  const { event, top, height, left, width } = positionedEvent;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={[
        "absolute overflow-hidden rounded-xl border px-3 py-2 text-left shadow-sm",
        isSelected ? "border-zinc-900 bg-zinc-100" : "border-zinc-200 bg-zinc-50",
      ].join(" ")}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${left}% + 4px)`,
        width: `calc(${width}% - 8px)`,
      }}
    >
      <p className="text-sm font-semibold text-zinc-900">{event.title}</p>
      <p className="mt-1 text-xs text-zinc-500">
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </p>

      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
      />
    </button>
  );
}
