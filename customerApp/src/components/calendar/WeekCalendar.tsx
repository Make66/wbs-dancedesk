import { useState } from "react";
import { addWeeks, startOfToday } from "date-fns";
import { CalendarHeader, type CalendarView } from "./CalendarHeader";
import { WeekGrid } from "./WeekGrid";
import { WeekHeader } from "./WeekHeader";
import { DraftEventPanel } from "./DraftEventPanel";
import { EventDetailsPanel } from "./EventDetailsPanel";
import type {
  CalendarEvent,
  DraftEvent,
  DragSelection,
  DraggedEventState,
  ResizingEventState,
  SelectedTimeRange,
} from "../../types/calendar-types";
import { SLOT_HEIGHT } from "../../lib/constants/calendar-constants";
import { getWeekDays } from "../../lib/calendar/date-utils";

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Design review",
    start: new Date(2026, 3, 6, 9, 0),
    end: new Date(2026, 3, 6, 10, 30),
  },
  {
    id: "2",
    title: "Client call",
    start: new Date(2026, 3, 7, 13, 0),
    end: new Date(2026, 3, 7, 14, 0),
  },
  {
    id: "3",
    title: "Planning",
    start: new Date(2026, 3, 9, 11, 30),
    end: new Date(2026, 3, 9, 13, 0),
  },
];

export function WeekCalendar() {
  const [currentView, setCurrentView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const days = getWeekDays(currentDate);

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedRange, setSelectedRange] = useState<SelectedTimeRange | null>(null);
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [draftEvent, setDraftEvent] = useState<DraftEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<DraggedEventState | null>(null);
  const [resizingEvent, setResizingEvent] = useState<ResizingEventState | null>(null);

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;

  function handlePreviousWeek() {
    setCurrentDate((prev) => addWeeks(prev, -1));
  }

  function handleNextWeek() {
    setCurrentDate((prev) => addWeeks(prev, 1));
  }

  function handleToday() {
    setCurrentDate(startOfToday());
  }

  function handleSelectRange(range: SelectedTimeRange) {
    setSelectedRange(range);
    setSelectedEventId(null);

    setDraftEvent({
      id: crypto.randomUUID(),
      title: "New event",
      start: range.start,
      end: range.end,
    });
  }

  function handleSelectEvent(eventId: string) {
    setSelectedEventId(eventId);
    setSelectedRange(null);
    setDraftEvent(null);
  }

  function handleDraftTitleChange(title: string) {
    if (!draftEvent) return;

    setDraftEvent({
      ...draftEvent,
      title,
    });
  }

  function handleSaveDraft() {
    if (!draftEvent) return;

    setEvents((prev) => [...prev, draftEvent]);
    setSelectedEventId(draftEvent.id);
    setDraftEvent(null);
    setSelectedRange(null);
  }

  function handleCancelDraft() {
    setDraftEvent(null);
    setSelectedRange(null);
  }

  function handleDeleteSelectedEvent() {
    if (!selectedEventId) return;

    setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
    setSelectedEventId(null);
  }

  function handleCloseEventDetails() {
    setSelectedEventId(null);
  }

  function handleEventDragStart(event: CalendarEvent, pointerOffsetY: number) {
    setDraggedEvent({
      eventId: event.id,
      originalStart: event.start,
      originalEnd: event.end,
      currentStart: event.start,
      currentEnd: event.end,
      pointerOffsetY,
    });

    setSelectedEventId(event.id);
    setDraftEvent(null);
    setSelectedRange(null);
  }

  function handleEventDragChange(nextStart: Date, nextEnd: Date) {
    setDraggedEvent((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        currentStart: nextStart,
        currentEnd: nextEnd,
      };
    });
  }

  function handleEventDragEnd() {
    if (!draggedEvent) return;

    setEvents((prev) =>
      prev.map((event) =>
        event.id === draggedEvent.eventId
          ? {
              ...event,
              start: draggedEvent.currentStart,
              end: draggedEvent.currentEnd,
            }
          : event,
      ),
    );

    setDraggedEvent(null);
  }

  function handleEventResizeStart(event: CalendarEvent) {
    setResizingEvent({
      eventId: event.id,
      originalStart: event.start,
      originalEnd: event.end,
      currentStart: event.start,
      currentEnd: event.end,
    });

    setSelectedEventId(event.id);
    setDraftEvent(null);
    setSelectedRange(null);
  }

  function handleEventResizeChange(nextEnd: Date) {
    setResizingEvent((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        currentEnd: nextEnd,
      };
    });
  }

  function handleEventResizeEnd() {
    if (!resizingEvent) return;

    setEvents((prev) =>
      prev.map((event) =>
        event.id === resizingEvent.eventId
          ? {
              ...event,
              start: resizingEvent.currentStart,
              end: resizingEvent.currentEnd,
            }
          : event,
      ),
    );

    setResizingEvent(null);
  }

  return (
    <div className="rounded-3xl border bg-white shadow-sm">
      <CalendarHeader
        days={days}
        currentView={currentView}
        onPrev={handlePreviousWeek}
        onNext={handleNextWeek}
        onToday={handleToday}
        onChangeView={setCurrentView}
      />

      <WeekHeader days={days} />

      <WeekGrid
        days={days}
        events={events}
        draftEvent={draftEvent}
        slotHeight={SLOT_HEIGHT}
        selectedRange={selectedRange}
        dragSelection={dragSelection}
        draggedEvent={draggedEvent}
        resizingEvent={resizingEvent}
        selectedEventId={selectedEventId}
        onSelectRange={handleSelectRange}
        onDragSelectionChange={setDragSelection}
        onSelectEvent={handleSelectEvent}
        onEventDragStart={handleEventDragStart}
        onEventDragChange={handleEventDragChange}
        onEventDragEnd={handleEventDragEnd}
        onEventResizeStart={handleEventResizeStart}
        onEventResizeChange={handleEventResizeChange}
        onEventResizeEnd={handleEventResizeEnd}
      />

      {draftEvent ? (
        <DraftEventPanel
          draftEvent={draftEvent}
          onTitleChange={handleDraftTitleChange}
          onSave={handleSaveDraft}
          onCancel={handleCancelDraft}
        />
      ) : selectedEvent ? (
        <EventDetailsPanel
          event={selectedEvent}
          onDelete={handleDeleteSelectedEvent}
          onClose={handleCloseEventDetails}
        />
      ) : null}
    </div>
  );
}
