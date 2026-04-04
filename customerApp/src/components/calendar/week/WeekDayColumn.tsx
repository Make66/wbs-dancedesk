import { useRef, useState } from "react";
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

type WeekDayColumnProps = {
  day: Date;
  events: CalendarEvent[];
  onEventResizeEnd?: (payload: CalendarEventResizeEndPayload) => void;
};

export function WeekDayColumn({ day, events, onEventResizeEnd }: WeekDayColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const config = calendarStore((state) => state.config);
  const selectedEventId = calendarStore((state) => state.selectedEventId);
  const resizingEvent = calendarStore((state) => state.resizingEvent);

  const selectEvent = calendarStore((state) => state.selectEvent);
  const startResize = calendarStore((state) => state.startResize);
  const updateResize = calendarStore((state) => state.updateResize);
  const endResize = calendarStore((state) => state.endResize);

  const dropData: CalendarDropData = {
    type: "day-column",
    day,
  };

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
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

  const renderedDayEvents = events
    .map((event) => {
      if (resizingEvent && event.id === resizingEvent.eventId) {
        return {
          ...event,
          start: resizingEvent.currentStart,
          end: resizingEvent.currentEnd,
        };
      }

      return event;
    })
    .filter((event) => isSameDay(event.start, day));

  const positionedEvents = getPositionedEvents(renderedDayEvents, config.slotHeight, config);

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
        setDroppableNodeRef(node);
      }}
      className="relative border-r border-zinc-200 last:border-r-0"
    >
      {Array.from({ length: visibleSlotCount }, (_, i) => {
        const slotIndex = startSlot + i;
        const isHourBoundary = slotIndex % slotsPerHour === 0;

        return (
          <div
            key={slotIndex}
            className={["relative w-full", isHourBoundary ? "border-t border-zinc-200" : ""].join(
              " ",
            )}
            style={{ height: `${config.slotHeight}px` }}
          />
        );
      })}

      <CurrentTimeLine day={day} slotHeight={config.slotHeight} config={config} />

      <div className="absolute inset-0 z-10">
        {positionedEvents.map((positionedEvent) => (
          <WeekEventCard
            key={positionedEvent.event.id}
            positionedEvent={positionedEvent}
            isSelected={selectedEventId === positionedEvent.event.id}
            onClick={() => selectEvent(positionedEvent.event.id)}
            onResizeMouseDown={(e) => handleResizeMouseDown(positionedEvent.event, e)}
          />
        ))}
      </div>
    </div>
  );
}
