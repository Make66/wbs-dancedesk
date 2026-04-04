import type {
  CalendarConfig,
  DraggedEventState,
  ResizingEventState,
} from "../../types/calendar-types";
import {
  addMinutesToDate,
  createDateWithTime,
  getDifferenceInMinutes,
  getMinutesSinceStartOfDay,
} from "./date-utils";

function snapMinutesToSlot(minutes: number, minutesPerSlot: number) {
  return Math.round(minutes / minutesPerSlot) * minutesPerSlot;
}

export function getDraggedEventTimes(params: {
  clientX: number;
  clientY: number;
  day: Date;
  rect: DOMRect;
  config: CalendarConfig;
  draggedEvent: DraggedEventState;
}) {
  const { clientX, clientY, day, rect, config, draggedEvent } = params;

  const isInsideColumn = clientX >= rect.left && clientX <= rect.right;
  if (!isInsideColumn) return null;

  const visibleStartMinutes = config.startHour * 60;
  const visibleEndMinutes = config.endHour * 60;

  const relativeY = clientY - rect.top - draggedEvent.pointerOffsetY;
  const rawMinutesFromVisibleStart = (relativeY / config.slotHeight) * config.minutesPerSlot;
  const snappedMinutesFromVisibleStart = snapMinutesToSlot(
    rawMinutesFromVisibleStart,
    config.minutesPerSlot,
  );

  const durationMinutes = getDifferenceInMinutes(
    draggedEvent.originalEnd,
    draggedEvent.originalStart,
  );

  const proposedStartMinutes = visibleStartMinutes + snappedMinutesFromVisibleStart;

  const clampedStartMinutes = Math.min(
    visibleEndMinutes - durationMinutes,
    Math.max(visibleStartMinutes, proposedStartMinutes),
  );

  const nextStart = createDateWithTime(day, 0, 0);
  nextStart.setMinutes(clampedStartMinutes);

  const nextEnd = addMinutesToDate(nextStart, durationMinutes);

  return {
    start: nextStart,
    end: nextEnd,
  };
}

export function getResizedEventEnd(params: {
  clientX: number;
  clientY: number;
  day: Date;
  rect: DOMRect;
  config: CalendarConfig;
  resizingEvent: ResizingEventState;
}) {
  const { clientX, clientY, day, rect, config, resizingEvent } = params;

  const isInsideColumn = clientX >= rect.left && clientX <= rect.right;
  if (!isInsideColumn) return null;

  const visibleStartMinutes = config.startHour * 60;
  const visibleEndMinutes = config.endHour * 60;

  const relativeY = clientY - rect.top;
  const rawMinutesFromVisibleStart = (relativeY / config.slotHeight) * config.minutesPerSlot;
  const snappedMinutesFromVisibleStart = snapMinutesToSlot(
    rawMinutesFromVisibleStart,
    config.minutesPerSlot,
  );
  const absoluteMinutes = visibleStartMinutes + snappedMinutesFromVisibleStart;

  const minimumEndMinutes =
    getMinutesSinceStartOfDay(resizingEvent.currentStart) + config.minutesPerSlot;

  const clampedMinutes = Math.min(visibleEndMinutes, Math.max(minimumEndMinutes, absoluteMinutes));

  const nextEnd = createDateWithTime(day, 0, 0);
  nextEnd.setMinutes(clampedMinutes);

  if (nextEnd <= resizingEvent.currentStart) return null;

  return nextEnd;
}
