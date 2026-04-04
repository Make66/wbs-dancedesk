import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { CurrentTimeLine } from "./CurrentTimeline";
import { DraftEventCard } from "./DraftEventCard";
import { EventCard } from "./EventCard";
import type {
  CalendarEvent,
  DraftEvent,
  DragSelection,
  DraggedEventState,
  ResizingEventState,
  SelectedTimeRange,
} from "../../types/calendar-types";
import {
  MINUTES_PER_SLOT,
  SLOTS_PER_HOUR,
  TOTAL_SLOTS,
} from "../../lib/constants/calendar-constants";
import {
  addMinutesToDate,
  createDateWithTime,
  getDifferenceInMinutes,
  getMinutesSinceStartOfDay,
  isSameDay,
  rangesOverlap,
} from "../../lib/calendar/date-utils";
import { getDraftEventStyle, getPositionedEvents } from "../../lib/calendar/event-layout";

type DayColumnProps = {
  day: Date;
  events: CalendarEvent[];
  draftEvent: DraftEvent | null;
  slotHeight: number;
  selectedRange: SelectedTimeRange | null;
  dragSelection: DragSelection | null;
  draggedEvent: DraggedEventState | null;
  resizingEvent: ResizingEventState | null;
  selectedEventId: string | null;
  onSelectRange: (range: SelectedTimeRange) => void;
  onDragSelectionChange: (range: DragSelection | null) => void;
  onSelectEvent: (eventId: string) => void;
  onEventDragStart: (event: CalendarEvent, pointerOffsetY: number) => void;
  onEventDragChange: (start: Date, end: Date) => void;
  onEventDragEnd: () => void;
  onEventResizeStart: (event: CalendarEvent) => void;
  onEventResizeChange: (end: Date) => void;
  onEventResizeEnd: () => void;
};

function getSlotStart(day: Date, slotIndex: number) {
  const totalMinutes = slotIndex * MINUTES_PER_SLOT;
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return createDateWithTime(day, hour, minutes);
}

function getSlotEnd(day: Date, slotIndex: number) {
  const start = getSlotStart(day, slotIndex);
  return new Date(start.getTime() + MINUTES_PER_SLOT * 60 * 1000);
}

export function DayColumn({
  day,
  events,
  draftEvent,
  slotHeight,
  selectedRange,
  dragSelection,
  draggedEvent,
  resizingEvent,
  selectedEventId,
  onSelectRange,
  onDragSelectionChange,
  onSelectEvent,
  onEventDragStart,
  onEventDragChange,
  onEventDragEnd,
  onEventResizeStart,
  onEventResizeChange,
  onEventResizeEnd,
}: DayColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);

  const [selectionDragStart, setSelectionDragStart] = useState<Date | null>(null);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  const activeRange = dragSelection ?? selectedRange;
  const shouldRenderDraft = draftEvent ? isSameDay(draftEvent.start, day) : false;

  const renderedDayEvents = events
    .map((event) => {
      if (draggedEvent && event.id === draggedEvent.eventId) {
        return {
          ...event,
          start: draggedEvent.currentStart,
          end: draggedEvent.currentEnd,
        };
      }

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

  const positionedEvents = getPositionedEvents(renderedDayEvents, slotHeight);

  function snapMinutesToSlot(minutes: number) {
    return Math.round(minutes / MINUTES_PER_SLOT) * MINUTES_PER_SLOT;
  }

  function handleSelectionMouseDown(slotIndex: number) {
    const slotStart = getSlotStart(day, slotIndex);
    const slotEnd = getSlotEnd(day, slotIndex);

    setSelectionDragStart(slotStart);
    onDragSelectionChange({
      start: slotStart,
      end: slotEnd,
    });
  }

  function handleSelectionMouseEnter(slotIndex: number) {
    if (!selectionDragStart) return;

    const hoveredSlotStart = getSlotStart(day, slotIndex);
    const hoveredSlotEnd = getSlotEnd(day, slotIndex);

    const startsBefore = selectionDragStart <= hoveredSlotStart;

    onDragSelectionChange({
      start: startsBefore ? selectionDragStart : hoveredSlotStart,
      end: startsBefore
        ? hoveredSlotEnd
        : new Date(selectionDragStart.getTime() + MINUTES_PER_SLOT * 60 * 1000),
    });
  }

  function handleEventMouseDown(event: CalendarEvent, clientY: number) {
    if (!columnRef.current) return;

    const rect = columnRef.current.getBoundingClientRect();
    const eventTop = (getMinutesSinceStartOfDay(event.start) / MINUTES_PER_SLOT) * slotHeight;
    const offsetY = clientY - rect.top - eventTop;

    onEventDragStart(event, offsetY);
  }

  function handleResizeMouseDown(event: CalendarEvent, e: ReactMouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setResizingEventId(event.id);
    onEventResizeStart(event);
  }

  useEffect(() => {
    function handleGlobalSelectionMouseUp() {
      if (!selectionDragStart) return;

      if (dragSelection) {
        onSelectRange(dragSelection);
        onDragSelectionChange(null);
      }

      setSelectionDragStart(null);
    }

    window.addEventListener("mouseup", handleGlobalSelectionMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalSelectionMouseUp);
    };
  }, [selectionDragStart, dragSelection, onSelectRange, onDragSelectionChange]);

  useEffect(() => {
    function handleGlobalEventMouseMove(e: MouseEvent) {
      if (!draggedEvent) return;
      if (!columnRef.current) return;

      const rect = columnRef.current.getBoundingClientRect();
      const isInsideColumn = e.clientX >= rect.left && e.clientX <= rect.right;

      if (!isInsideColumn) return;

      const relativeY = e.clientY - rect.top - draggedEvent.pointerOffsetY;
      const rawMinutes = (relativeY / slotHeight) * MINUTES_PER_SLOT;
      const snappedMinutes = Math.max(0, snapMinutesToSlot(rawMinutes));

      const durationMinutes = getDifferenceInMinutes(
        draggedEvent.originalEnd,
        draggedEvent.originalStart,
      );

      const nextStart = createDateWithTime(day, 0, 0);
      nextStart.setMinutes(snappedMinutes);

      const nextEnd = addMinutesToDate(nextStart, durationMinutes);

      onEventDragChange(nextStart, nextEnd);
    }

    function handleGlobalEventMouseUp() {
      if (!draggedEvent) return;
      onEventDragEnd();
    }

    window.addEventListener("mousemove", handleGlobalEventMouseMove);
    window.addEventListener("mouseup", handleGlobalEventMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalEventMouseMove);
      window.removeEventListener("mouseup", handleGlobalEventMouseUp);
    };
  }, [day, draggedEvent, slotHeight, onEventDragChange, onEventDragEnd]);

  useEffect(() => {
    function handleGlobalResizeMouseMove(e: MouseEvent) {
      if (!resizingEvent) return;
      if (!columnRef.current) return;
      if (!resizingEventId) return;

      const rect = columnRef.current.getBoundingClientRect();
      const isInsideColumn = e.clientX >= rect.left && e.clientX <= rect.right;

      if (!isInsideColumn) return;

      const relativeY = e.clientY - rect.top;
      const rawMinutes = (relativeY / slotHeight) * MINUTES_PER_SLOT;
      const snappedMinutes = Math.max(
        MINUTES_PER_SLOT,
        Math.round(rawMinutes / MINUTES_PER_SLOT) * MINUTES_PER_SLOT,
      );

      const nextEnd = createDateWithTime(day, 0, 0);
      nextEnd.setMinutes(snappedMinutes);

      if (nextEnd <= resizingEvent.currentStart) return;

      onEventResizeChange(nextEnd);
    }

    function handleGlobalResizeMouseUp() {
      if (!resizingEventId) return;

      onEventResizeEnd();
      setResizingEventId(null);
    }

    window.addEventListener("mousemove", handleGlobalResizeMouseMove);
    window.addEventListener("mouseup", handleGlobalResizeMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
      window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
    };
  }, [day, resizingEvent, resizingEventId, slotHeight, onEventResizeChange, onEventResizeEnd]);

  return (
    <div ref={columnRef} className="relative border-r border-zinc-200 last:border-r-0">
      {Array.from({ length: TOTAL_SLOTS }, (_, slotIndex) => {
        const slotStart = getSlotStart(day, slotIndex);
        const slotEnd = getSlotEnd(day, slotIndex);

        const isSelected =
          activeRange && rangesOverlap(activeRange.start, activeRange.end, slotStart, slotEnd);

        const isHourBoundary = slotIndex % SLOTS_PER_HOUR === 0;

        return (
          <button
            key={slotIndex}
            type="button"
            onMouseDown={() => handleSelectionMouseDown(slotIndex)}
            onMouseEnter={() => handleSelectionMouseEnter(slotIndex)}
            className={[
              "relative block w-full text-left select-none",
              isSelected ? "bg-zinc-100" : "bg-transparent",
              isHourBoundary ? "border-t border-zinc-200" : "",
            ].join(" ")}
            style={{ height: `${slotHeight}px` }}
          />
        );
      })}

      <CurrentTimeLine day={day} slotHeight={slotHeight} />

      <div className="absolute inset-0 z-10">
        {positionedEvents.map((positionedEvent) => (
          <EventCard
            key={positionedEvent.event.id}
            positionedEvent={positionedEvent}
            isSelected={selectedEventId === positionedEvent.event.id}
            onClick={() => onSelectEvent(positionedEvent.event.id)}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleEventMouseDown(positionedEvent.event, e.clientY);
            }}
            onResizeMouseDown={(e) => handleResizeMouseDown(positionedEvent.event, e)}
          />
        ))}

        {shouldRenderDraft && draftEvent ? (
          <DraftEventCard
            draftEvent={draftEvent}
            style={getDraftEventStyle(draftEvent, slotHeight)}
          />
        ) : null}
      </div>
    </div>
  );
}
