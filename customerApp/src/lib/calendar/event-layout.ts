import type {
  CalendarEvent,
  DraftEvent,
  PositionedCalendarEvent,
} from "../../types/calendar-types";
import { getMinutesSinceStartOfDay } from "./date-utils";
import { MINUTES_PER_SLOT, START_HOUR, END_HOUR } from "../constants/calendar-constants";

function eventsOverlap(a: CalendarEvent, b: CalendarEvent) {
  return a.start < b.end && b.start < a.end;
}

function getVisibleRangeStartMinutes() {
  return START_HOUR * 60;
}

function getVisibleRangeEndMinutes() {
  return END_HOUR * 60;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTop(start: Date, slotHeight: number) {
  const visibleStart = getVisibleRangeStartMinutes();
  const startMinutes = getMinutesSinceStartOfDay(start);

  const clampedStart = Math.max(startMinutes, visibleStart);
  const relativeMinutes = clampedStart - visibleStart;

  return (relativeMinutes / MINUTES_PER_SLOT) * slotHeight;
}

function getHeight(start: Date, end: Date, slotHeight: number) {
  const visibleStart = getVisibleRangeStartMinutes();
  const visibleEnd = getVisibleRangeEndMinutes();

  const startMinutes = getMinutesSinceStartOfDay(start);
  const endMinutes = getMinutesSinceStartOfDay(end);

  const clippedStart = clamp(startMinutes, visibleStart, visibleEnd);
  const clippedEnd = clamp(endMinutes, visibleStart, visibleEnd);

  const durationMinutes = Math.max(0, clippedEnd - clippedStart);

  return (durationMinutes / MINUTES_PER_SLOT) * slotHeight;
}

function isEventVisible(event: CalendarEvent) {
  const visibleStart = getVisibleRangeStartMinutes();
  const visibleEnd = getVisibleRangeEndMinutes();

  const startMinutes = getMinutesSinceStartOfDay(event.start);
  const endMinutes = getMinutesSinceStartOfDay(event.end);

  return endMinutes > visibleStart && startMinutes < visibleEnd;
}

function groupOverlappingEvents(events: CalendarEvent[]) {
  const groups: CalendarEvent[][] = [];
  let currentGroup: CalendarEvent[] = [];

  for (const event of events) {
    if (currentGroup.length === 0) {
      currentGroup.push(event);
      continue;
    }

    const overlaps = currentGroup.some((e) => eventsOverlap(e, event));

    if (overlaps) {
      currentGroup.push(event);
    } else {
      groups.push(currentGroup);
      currentGroup = [event];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

function assignColumns(group: CalendarEvent[]) {
  const columns: CalendarEvent[][] = [];

  for (const event of group) {
    let placed = false;

    for (const column of columns) {
      const last = column[column.length - 1];

      if (!eventsOverlap(last, event)) {
        column.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([event]);
    }
  }

  return columns;
}

export function getPositionedEvents(
  events: CalendarEvent[],
  slotHeight: number,
): PositionedCalendarEvent[] {
  const visibleEvents = events.filter(isEventVisible);

  const sorted = [...visibleEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

  const groups = groupOverlappingEvents(sorted);
  const positioned: PositionedCalendarEvent[] = [];

  for (const group of groups) {
    const columns = assignColumns(group);
    const columnCount = columns.length;

    columns.forEach((column, columnIndex) => {
      column.forEach((event) => {
        positioned.push({
          event,
          top: getTop(event.start, slotHeight),
          height: getHeight(event.start, event.end, slotHeight),
          left: (100 / columnCount) * columnIndex,
          width: 100 / columnCount,
        });
      });
    });
  }

  return positioned;
}

export function getDraftEventStyle(draftEvent: DraftEvent, slotHeight: number) {
  return {
    top: `${getTop(draftEvent.start, slotHeight)}px`,
    height: `${getHeight(draftEvent.start, draftEvent.end, slotHeight)}px`,
    left: "4px",
    width: "calc(100% - 8px)",
  };
}
