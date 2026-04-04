import type {
  CalendarConfig,
  CalendarEvent,
  PositionedCalendarEvent,
} from "../../types/calendar-types";
import { getMinutesSinceStartOfDay } from "./date-utils";

function eventsOverlap(a: CalendarEvent, b: CalendarEvent) {
  return a.start < b.end && b.start < a.end;
}

function getVisibleRangeStartMinutes(config: CalendarConfig) {
  return config.startHour * 60;
}

function getVisibleRangeEndMinutes(config: CalendarConfig) {
  return config.endHour * 60;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTop(start: Date, slotHeight: number, config: CalendarConfig) {
  const visibleStart = getVisibleRangeStartMinutes(config);
  const startMinutes = getMinutesSinceStartOfDay(start);

  const clampedStart = Math.max(startMinutes, visibleStart);
  const relativeMinutes = clampedStart - visibleStart;

  return (relativeMinutes / config.minutesPerSlot) * slotHeight;
}

function getHeight(start: Date, end: Date, slotHeight: number, config: CalendarConfig) {
  const visibleStart = getVisibleRangeStartMinutes(config);
  const visibleEnd = getVisibleRangeEndMinutes(config);

  const startMinutes = getMinutesSinceStartOfDay(start);
  const endMinutes = getMinutesSinceStartOfDay(end);

  const clippedStart = clamp(startMinutes, visibleStart, visibleEnd);
  const clippedEnd = clamp(endMinutes, visibleStart, visibleEnd);

  const durationMinutes = Math.max(0, clippedEnd - clippedStart);

  return (durationMinutes / config.minutesPerSlot) * slotHeight;
}

function isEventVisible(event: CalendarEvent, config: CalendarConfig) {
  const visibleStart = getVisibleRangeStartMinutes(config);
  const visibleEnd = getVisibleRangeEndMinutes(config);

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

    const overlaps = currentGroup.some((existingEvent) => eventsOverlap(existingEvent, event));

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
  config: CalendarConfig,
): PositionedCalendarEvent[] {
  const visibleEvents = events.filter((event) => isEventVisible(event, config));
  const sortedEvents = [...visibleEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

  const groups = groupOverlappingEvents(sortedEvents);
  const positionedEvents: PositionedCalendarEvent[] = [];

  for (const group of groups) {
    const columns = assignColumns(group);
    const columnCount = columns.length;

    columns.forEach((column, columnIndex) => {
      column.forEach((event) => {
        positionedEvents.push({
          event,
          top: getTop(event.start, slotHeight, config),
          height: getHeight(event.start, event.end, slotHeight, config),
          left: (100 / columnCount) * columnIndex,
          width: 100 / columnCount,
        });
      });
    });
  }

  return positionedEvents;
}
