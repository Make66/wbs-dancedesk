import type {
  CalendarEvent,
  DraftEvent,
  PositionedCalendarEvent,
} from "../../types/calendar-types";
import { getMinutesSinceStartOfDay } from "./date-utils";
import { MINUTES_PER_SLOT } from "../constants/calendar-constants";

/**
 * Determines if two events overlap in time.
 * @param a - First event
 * @param b - Second event
 * @returns - True if events overlap, false otherwise
 */
function eventsOverlap(a: CalendarEvent, b: CalendarEvent) {
  return a.start < b.end && b.start < a.end;
}

/**
 * Calculates the position and size of calendar events for rendering in a day column.
 * @param event - The calendar event to calculate the position for
 * @param slotHeight - The height of one hour slot in pixels
 * @returns - An object containing the top position, height, left position, and width percentage for the event
 */
function getTop(start: Date, slotHeight: number) {
  const minutes = getMinutesSinceStartOfDay(start);
  const slotIndex = minutes / MINUTES_PER_SLOT;

  return slotIndex * slotHeight;
}

/**
 * Calculates the height of a calendar event based on its duration.
 * @param start - The start time of the event
 * @param end - The end time of the event
 * @param slotHeight - The height of one hour slot in pixels
 * @returns - The height in pixels that the event should occupy in the calendar
 */
function getHeight(start: Date, end: Date, slotHeight: number) {
  const durationMinutes = getMinutesSinceStartOfDay(end) - getMinutesSinceStartOfDay(start);

  const slotCount = durationMinutes / MINUTES_PER_SLOT;

  return slotCount * slotHeight;
}

/**
 * Groups overlapping events together and assigns them columns for rendering in a day view.
 * @param events - An array of calendar events to be positioned
 * @returns - An array of positioned calendar events with calculated top, height, left, and width properties for rendering
 */
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

/**
 * Assigns events to columns within their overlapping group to determine their horizontal position in the calendar.
 * @param group - An array of overlapping calendar events that need to be assigned to columns
 * @returns - An array of columns, where each column is an array of non-overlapping events that can be rendered in the same vertical space without overlap
 */
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

/**
 * Calculates the positioned events for a given set of calendar events and slot height. This function groups overlapping events, assigns them to columns, and calculates their top, height, left, and width properties for rendering in a day view of the calendar.
 * @param events - An array of calendar events to be positioned
 * @param slotHeight - The height of one hour slot in pixels, used to calculate the vertical position and height of events
 * @returns - An array of positioned calendar events with calculated top, height, left, and width properties for rendering in the calendar
 */
export function getPositionedEvents(
  events: CalendarEvent[],
  slotHeight: number,
): PositionedCalendarEvent[] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

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

/**
 * Calculates the style properties for a draft event based on its start and end times and the slot height.
 * @param draftEvent - The draft event for which to calculate the style
 * @param slotHeight - The height of one hour slot in pixels, used to calculate the vertical position and height of the draft event
 * @returns - An object containing the top position, height, left position, and width for the draft event, which can be used for inline styling when rendering the draft event in the calendar
 */
export function getDraftEventStyle(draftEvent: DraftEvent, slotHeight: number) {
  return {
    top: `${getTop(draftEvent.start, slotHeight)}px`,
    height: `${getHeight(draftEvent.start, draftEvent.end, slotHeight)}px`,
    left: "4px",
    width: "calc(100% - 8px)",
  };
}
