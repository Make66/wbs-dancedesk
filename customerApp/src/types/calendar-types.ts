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

export type DraftEvent = {
  id: string;
  title: string;
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
