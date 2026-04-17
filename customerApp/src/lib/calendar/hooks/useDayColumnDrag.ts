import { useEffect } from "react";
import type {
  CalendarConfig,
  CalendarEventDragEndPayload,
  DraggedItemState,
} from "../../../types/calendar-types";
import { getDraggedEventTimes } from "../calendar-interactions";

type UseDayColumnDragParams = {
  day: Date;
  columnRef: React.RefObject<HTMLDivElement | null>;
  config: CalendarConfig;
  draggedEvent: DraggedItemState | null;
  updateDrag: (start: Date, end: Date) => void;
  endDrag: () => CalendarEventDragEndPayload | null;
  onEventDragEnd?: (payload: CalendarEventDragEndPayload) => void;
};

export function useDayColumnDrag({
  day,
  columnRef,
  config,
  draggedEvent,
  updateDrag,
  endDrag,
  onEventDragEnd,
}: UseDayColumnDragParams) {
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!draggedEvent || !columnRef.current) return;

      const rect = columnRef.current.getBoundingClientRect();

      const nextTimes = getDraggedEventTimes({
        clientX: e.clientX,
        clientY: e.clientY,
        day,
        rect,
        config,
        draggedEvent,
      });

      if (!nextTimes) return;

      updateDrag(nextTimes.start, nextTimes.end);
    }

    function handleMouseUp() {
      if (!draggedEvent) return;

      const payload = endDrag();
      if (payload) {
        onEventDragEnd?.(payload);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [day, draggedEvent, config, updateDrag, endDrag, onEventDragEnd, columnRef]);
}
