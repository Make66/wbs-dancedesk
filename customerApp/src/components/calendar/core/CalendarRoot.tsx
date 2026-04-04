import { useCallback, useMemo } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekView } from "../week/CalendarWeekView";
import type {
  CalendarEvent,
  CalendarEventDragEndPayload,
  CalendarEventResizeEndPayload,
  CalendarDragData,
} from "../../../types/calendar-types";
import { getCalendarHeaderDisplayData } from "../../../lib/calendar/date-utils";
import { getCalendarDragEndPayload } from "../../../lib/calendar/calendar-dnd";
import { calendarStore } from "../../../stores/calendarStore";

type Props = {
  events: CalendarEvent[];
  onEventDragEnd?: (payload: CalendarEventDragEndPayload) => void;
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function CalendarRoot({ events, onEventDragEnd, onEventResizeEnd }: Props) {
  const currentView = calendarStore((s) => s.currentView);
  const currentDate = calendarStore((s) => s.currentDate);
  const config = calendarStore((s) => s.config);
  const activeDragEventId = calendarStore((s) => s.activeDragEventId);

  const setActiveDragEventId = calendarStore((s) => s.setActiveDragEventId);
  const selectEvent = calendarStore((s) => s.selectEvent);

  const headerDisplayData = useMemo(
    () => getCalendarHeaderDisplayData(currentView, currentDate),
    [currentView, currentDate],
  );

  const activeDragEvent = useMemo(
    () => events.find((e) => e.id === activeDragEventId) ?? null,
    [events, activeDragEventId],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current as CalendarDragData | undefined;
      if (data?.type === "calendar-event") {
        selectEvent(data.eventId);
        setActiveDragEventId(data.eventId);
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
        {currentView === "week" && (
          <CalendarWeekView events={events} onEventResizeEnd={onEventResizeEnd} />
        )}

        {currentView === "day" && <div className="p-6">Day View kommt als Nächstes</div>}
        {currentView === "month" && <div className="p-6">Month View kommt als Nächstes</div>}

        <DragOverlay>
          {activeDragEvent ? (
            <div className="rounded-xl border bg-white px-3 py-2 shadow-lg opacity-90">
              <p className="text-sm font-semibold">{activeDragEvent.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
