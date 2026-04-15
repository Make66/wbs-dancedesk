import { useCallback, useMemo } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";

import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekView } from "../week/CalendarWeekView";
import { CalendarDayView } from "../day/CalendarDayView";

import type {
  CalendarItem,
  CalendarItemDragEndPayload,
  CalendarItemResizeEndPayload,
  CalendarDragData,
} from "../../../types/calendar-types";
import type { Room } from "../../../types/room-types";

import { getCalendarHeaderDisplayData } from "../../../lib/calendar/date-utils";
import { getCalendarDragEndPayload } from "../../../lib/calendar/calendar-dnd";
import { calendarStore } from "../../../stores/calendarStore";
import { settingsStore } from "../../../stores/settingsStore";

type Props = {
  items: CalendarItem[];
  rooms?: Room[];
  onEventDragEnd?: (payload: CalendarItemDragEndPayload) => void;
  onEventResizeEnd?: (payload: CalendarItemResizeEndPayload) => void;
};

export function CalendarRoot({ items, rooms, onEventDragEnd, onEventResizeEnd }: Props) {
  const currentView = calendarStore((s) => s.currentView);
  const currentDate = calendarStore((s) => s.currentDate);
  const config = settingsStore((s) => s.settings.calendar);

  const setActiveDragEventId = calendarStore((s) => s.setActiveDragEventId);
  const selectEvent = calendarStore((s) => s.selectEvent);

  const headerDisplayData = useMemo(
    () => getCalendarHeaderDisplayData(currentView, currentDate),
    [currentView, currentDate],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current as CalendarDragData | undefined;

      if (data?.type === "calendar-item") {
        selectEvent(data.itemId);
        setActiveDragEventId(data.itemId);
      }
    },
    [selectEvent, setActiveDragEventId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const payload = getCalendarDragEndPayload({
        active: event.active,
        over: event.over,
        config,
      });

      setActiveDragEventId(null);
      if (!payload) return;

      onEventDragEnd?.(payload);
    },
    [config, onEventDragEnd, setActiveDragEventId],
  );

  const handleDragCancel = useCallback(() => {
    setActiveDragEventId(null);
  }, [setActiveDragEventId]);

  return (
    <div className="rounded-3xl border shadow-sm">
      <CalendarHeader displayData={headerDisplayData} />

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {currentView === "day" && (
          <CalendarDayView items={items} rooms={rooms} onEventResizeEnd={onEventResizeEnd} />
        )}

        {currentView === "week" && (
          <CalendarWeekView items={items} rooms={rooms} onEventResizeEnd={onEventResizeEnd} />
        )}

        <DragOverlay>{null}</DragOverlay>
      </DndContext>
    </div>
  );
}
