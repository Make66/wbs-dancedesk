import type { Active, Over } from "@dnd-kit/core";
import type {
  CalendarConfig,
  CalendarDragData,
  CalendarDropData,
  CalendarEventDragEndPayload,
} from "../../types/calendar-types";
import { addMinutesToDate, createDateWithTime, getDifferenceInMinutes } from "./date-utils";

function snapMinutesToSlot(minutes: number, minutesPerSlot: number) {
  return Math.round(minutes / minutesPerSlot) * minutesPerSlot;
}

export function getCalendarDragEndPayload(params: {
  active: Active;
  over: Over | null;
  config: CalendarConfig;
}): CalendarEventDragEndPayload | null {
  const { active, over, config } = params;

  if (!over) return null;

  const activeData = active.data.current as CalendarDragData | undefined;
  const overData = over.data.current as CalendarDropData | undefined;

  if (!activeData || activeData.type !== "calendar-event") return null;
  if (!overData || overData.type !== "day-column") return null;

  const translatedTop = active.rect.current.translated?.top;
  const overTop = over.rect.top;

  if (translatedTop == null || overTop == null) return null;

  const visibleStartMinutes = config.startHour * 60;
  const visibleEndMinutes = config.endHour * 60;

  const rawMinutesFromVisibleStart =
    ((translatedTop - overTop) / config.slotHeight) * config.minutesPerSlot;

  const snappedMinutesFromVisibleStart = snapMinutesToSlot(
    rawMinutesFromVisibleStart,
    config.minutesPerSlot,
  );

  const durationMinutes = getDifferenceInMinutes(activeData.end, activeData.start);

  const proposedStartMinutes = visibleStartMinutes + snappedMinutesFromVisibleStart;

  const clampedStartMinutes = Math.min(
    visibleEndMinutes - durationMinutes,
    Math.max(visibleStartMinutes, proposedStartMinutes),
  );

  const nextStart = createDateWithTime(overData.day, 0, 0);
  nextStart.setMinutes(clampedStartMinutes);

  const nextEnd = addMinutesToDate(nextStart, durationMinutes);

  return {
    eventId: activeData.eventId,
    originalStart: activeData.start,
    originalEnd: activeData.end,
    start: nextStart,
    end: nextEnd,
  };
}
