import { useCallback, useMemo } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekView } from "../week/CalendarWeekView";
import type {
  CalendarDragData,
  CalendarEvent,
  CalendarEventDragEndPayload,
  CalendarEventResizeEndPayload,
} from "../../../types/calendar-types";
import { getCalendarHeaderDisplayData } from "../../../lib/calendar/date-utils";
import { getCalendarDragEndPayload } from "../../../lib/calendar/calendar-dnd";
import { calendarStore } from "../../../stores/calendarStore";

type CalendarRootProps = {
  events: CalendarEvent[];
  onEventDragEnd?: (payload: CalendarEventDragEndPayload) => void;
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function CalendarRoot({ events, onEventDragEnd, onEventResizeEnd }: CalendarRootProps) {
  const currentView = calendarStore((state) => state.currentView);
  const currentDate = calendarStore((state) => state.currentDate);
  const config = calendarStore((state) => state.config);
  const activeDragEventId = calendarStore((state) => state.activeDragEventId);

  const headerDisplayData = useMemo(
    () => getCalendarHeaderDisplayData(currentView, currentDate),
    [currentView, currentDate],
  );

  const activeDragEvent = useMemo(
    () => events.find((event) => event.id === activeDragEventId) ?? null,
    [events, activeDragEventId],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as CalendarDragData | undefined;

    if (data?.type === "calendar-event") {
      const store = calendarStore.getState();
      store.selectEvent(data.eventId);
      store.setActiveDragEventId(data.eventId);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const payload = getCalendarDragEndPayload({
        active: event.active,
        over: event.over,
        config,
      });

      calendarStore.getState().setActiveDragEventId(null);

      if (!payload) return;

      onEventDragEnd?.(payload);
    },
    [config, onEventDragEnd],
  );

  const handleDragCancel = useCallback(() => {
    calendarStore.getState().setActiveDragEventId(null);
  }, []);

  return (
    <div className="rounded-3xl border shadow-sm">
      <CalendarHeader displayData={headerDisplayData} />

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {currentView === "week" && (
          <CalendarWeekView events={events} onEventResizeEnd={onEventResizeEnd} />
        )}

        {currentView === "day" && <div className="p-6">Day View kommt als Nächstes</div>}
        {currentView === "month" && <div className="p-6">Month View kommt als Nächstes</div>}

        <DragOverlay>
          {activeDragEvent ? (
            <CalendarDragOverlayCard event={activeDragEvent} config={config} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
