import type {
  CalendarConfig,
  CalendarItem,
  PositionedCalendarItem,
} from "../../types/calendar-types";
import { getMinutesSinceStartOfDay } from "./date-utils";

function itemsOverlap(a: CalendarItem, b: CalendarItem) {
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

function isItemVisible(item: CalendarItem, config: CalendarConfig) {
  const visibleStart = getVisibleRangeStartMinutes(config);
  const visibleEnd = getVisibleRangeEndMinutes(config);

  const startMinutes = getMinutesSinceStartOfDay(item.start);
  const endMinutes = getMinutesSinceStartOfDay(item.end);

  return endMinutes > visibleStart && startMinutes < visibleEnd;
}

function groupOverlappingItems(items: CalendarItem[]) {
  const groups: CalendarItem[][] = [];
  let currentGroup: CalendarItem[] = [];

  for (const item of items) {
    if (currentGroup.length === 0) {
      currentGroup.push(item);
      continue;
    }

    const overlaps = currentGroup.some((existingItem) => itemsOverlap(existingItem, item));

    if (overlaps) {
      currentGroup.push(item);
    } else {
      groups.push(currentGroup);
      currentGroup = [item];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

function assignColumns(group: CalendarItem[]) {
  const columns: CalendarItem[][] = [];

  for (const item of group) {
    let placed = false;

    for (const column of columns) {
      const last = column[column.length - 1];

      if (!itemsOverlap(last, item)) {
        column.push(item);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([item]);
    }
  }

  return columns;
}

export function getPositionedCalendarItems(
  items: CalendarItem[],
  slotHeight: number,
  config: CalendarConfig,
): PositionedCalendarItem[] {
  const visibleItems = items.filter((item) => isItemVisible(item, config));
  const sortedItems = [...visibleItems].sort((a, b) => a.start.getTime() - b.start.getTime());

  const groups = groupOverlappingItems(sortedItems);
  const positionedItems: PositionedCalendarItem[] = [];

  for (const group of groups) {
    const columns = assignColumns(group);
    const columnCount = columns.length;

    columns.forEach((column, columnIndex) => {
      column.forEach((item) => {
        positionedItems.push({
          item,
          top: getTop(item.start, slotHeight, config),
          height: getHeight(item.start, item.end, slotHeight, config),
          left: (100 / columnCount) * columnIndex,
          width: 100 / columnCount,
        });
      });
    });
  }

  return positionedItems;
}
