import { useEffect } from "react";
import type {
  CalendarConfig,
  CalendarItemResizeEndPayload,
  ResizingItemState,
} from "../../../types/calendar-types";
import { getResizedEventEnd } from "../calendar-interactions";

type UseDayColumnResizeParams = {
  day: Date;
  columnRef: React.RefObject<HTMLDivElement | null>;
  config: CalendarConfig;
  resizingEvent: ResizingItemState | null;
  resizingEventId: string | null;
  setResizingEventId: (id: string | null) => void;
  updateResize: (end: Date) => void;
  endResize: () => CalendarItemResizeEndPayload | null;
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function useDayColumnResize({
  day,
  columnRef,
  config,
  resizingEvent,
  resizingEventId,
  setResizingEventId,
  updateResize,
  endResize,
  onEventResizeEnd,
}: UseDayColumnResizeParams) {
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!resizingEvent || !columnRef.current || !resizingEventId) return;

      const rect = columnRef.current.getBoundingClientRect();

      const nextEnd = getResizedEventEnd({
        clientX: e.clientX,
        clientY: e.clientY,
        day,
        rect,
        config,
        resizingEvent,
      });

      if (!nextEnd) return;

      updateResize(nextEnd);
    }

    function handleMouseUp() {
      if (!resizingEventId) return;

      const payload = endResize();
      if (payload) {
        onEventResizeEnd?.(payload);
      }

      setResizingEventId(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    day,
    resizingEvent,
    resizingEventId,
    config,
    updateResize,
    endResize,
    onEventResizeEnd,
    columnRef,
  ]);
}
