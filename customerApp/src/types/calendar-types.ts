export type CalendarView = "day" | "week" | "month";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export type PositionedCalendarEvent = {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
};

export type SelectedTimeRange = {
  start: Date;
  end: Date;
};

export type DragSelection = {
  start: Date;
  end: Date;
};

export type DraggedEventState = {
  eventId: string;
  originalStart: Date;
  originalEnd: Date;
  currentStart: Date;
  currentEnd: Date;
  pointerOffsetY: number;
};

export type ResizingEventState = {
  eventId: string;
  originalStart: Date;
  originalEnd: Date;
  currentStart: Date;
  currentEnd: Date;
};

export type CalendarEventDragEndPayload = {
  eventId: string;
  originalStart: Date;
  originalEnd: Date;
  start: Date;
  end: Date;
};

export type CalendarEventResizeEndPayload = {
  eventId: string;
  originalStart: Date;
  originalEnd: Date;
  start: Date;
  end: Date;
};

export type CalendarConfig = {
  startHour: number;
  endHour: number;
  slotHeight: number;
  minutesPerSlot: number;
};

export type CalendarHeaderDisplayData = {
  monthLabel: string;
  weekLabel?: string;
  rangeLabel?: string;
  todayMonthLabel: string;
  todayDayLabel: string;
};

export type CalendarDragData = {
  type: "calendar-event";
  eventId: string;
  start: Date;
  end: Date;
};

export type CalendarDropData = {
  type: "day-column";
  day: Date;
};
