import { useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CurrentTimeLine } from "../core/CurrentTimeLine";
import { WeekEventCard } from "./WeekEventCard";
import type {
  CalendarDropData,
  CalendarEvent,
  CalendarEventResizeEndPayload,
} from "../../../types/calendar-types";
import {
  getSlotsPerHour,
  getStartSlot,
  getVisibleSlotCount,
} from "../../../lib/constants/calendar-constants";
import { getPositionedEvents } from "../../../lib/calendar/event-layout";
import { isSameDay } from "../../../lib/calendar/date-utils";
import { calendarStore } from "../../../stores/calendarStore";
import { useDayColumnResize } from "../../../lib/calendar/hooks/useDayColumnResize";

type Props = {
  day: Date;
  events: CalendarEvent[];
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function WeekDayColumn({ day, events, onEventResizeEnd }: Props) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const config = calendarStore((s) => s.config);
  const selectedEventId = calendarStore((s) => s.selectedEventId);
  const resizingEvent = calendarStore((s) => s.resizingEvent);

  const selectEvent = calendarStore((s) => s.selectEvent);
  const startResize = calendarStore((s) => s.startResize);
  const updateResize = calendarStore((s) => s.updateResize);
  const endResize = calendarStore((s) => s.endResize);

  const dropData: CalendarDropData = { type: "day-column", day };

  const { setNodeRef } = useDroppable({
    id: `day-${day.toISOString()}`,
    data: dropData,
  });

  useDayColumnResize({
    day,
    columnRef,
    config,
    resizingEvent,
    resizingEventId,
    setResizingEventId,
    updateResize,
    endResize,
    onEventResizeEnd,
  });

  const renderedEvents = useMemo(() => {
    return events
      .map((e) => {
        if (resizingEvent && e.id === resizingEvent.eventId) {
          return { ...e, start: resizingEvent.currentStart, end: resizingEvent.currentEnd };
        }
        return e;
      })
      .filter((e) => isSameDay(e.start, day));
  }, [events, resizingEvent, day]);

  const positionedEvents = useMemo(
    () => getPositionedEvents(renderedEvents, config.slotHeight, config),
    [renderedEvents, config],
  );

  const startSlot = getStartSlot(config);
  const visibleSlotCount = getVisibleSlotCount(config);
  const slotsPerHour = getSlotsPerHour(config);

  function handleResizeMouseDown(event: CalendarEvent, e: ReactMouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setResizingEventId(event.id);
    startResize(event);
  }

  return (
    <div
      ref={(node) => {
        columnRef.current = node;
        setNodeRef(node);
      }}
      className="relative border-r last:border-r-0"
    >
      {Array.from({ length: visibleSlotCount }, (_, i) => {
        const slotIndex = startSlot + i;
        const isHour = slotIndex % slotsPerHour === 0;

        return (
          <div
            key={slotIndex}
            className={isHour ? "border-t" : ""}
            style={{ height: `${config.slotHeight}px` }}
          />
        );
      })}

      <CurrentTimeLine day={day} slotHeight={config.slotHeight} config={config} />

      <div className="absolute inset-0 z-10">
        {positionedEvents.map((p) => (
          <WeekEventCard
            key={p.event.id}
            positionedEvent={p}
            isSelected={selectedEventId === p.event.id}
            onClick={() => selectEvent(p.event.id)}
            onResizeMouseDown={(e) => handleResizeMouseDown(p.event, e)}
          />
        ))}
      </div>
    </div>
  );
}
