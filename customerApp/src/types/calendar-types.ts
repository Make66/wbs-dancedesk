export type CalendarView = "day" | "week" | "month";

export type CalendarItemKind = "event" | "course";

export type CalendarEventItem = {
  kind: "event";
  id: string;
  courseId?: string;
  eventId: string;
  title: string;
  start: Date;
  end: Date;
  color?: string[];
  icon?: string;
  type?: string;
  description?: string;
  imageUrl?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
  roomId?: string;
  locationId?: string;
  targets?: string[];
  isActive?: boolean;
  isDeleted?: boolean;
};

export type CalendarCourseItem = {
  kind: "course";
  id: string;
  courseId: string;
  title: string;
  start: Date;
  end: Date;
  color?: string[];
  roomId?: string;
  slug?: string;
  occurrenceDate: string;
  isStart?: boolean;
};

export type CalendarItem = CalendarEventItem | CalendarCourseItem;

export type PositionedCalendarItem = {
  item: CalendarItem;
  top: number;
  height: number;
  left: number;
  width: number;
};

export type DraggedItemState = {
  itemId: string;
  itemKind: CalendarItemKind;
  originalStart: Date;
  originalEnd: Date;
  currentStart: Date;
  currentEnd: Date;
  pointerOffsetY: number;
};

export type ResizingItemState = {
  itemId: string;
  itemKind: CalendarItemKind;
  originalStart: Date;
  originalEnd: Date;
  currentStart: Date;
  currentEnd: Date;
};

export type CalendarItemDragEndPayload = {
  itemId: string;
  itemKind: CalendarItemKind;
  originalStart: Date;
  originalEnd: Date;
  start: Date;
  end: Date;
};

export type CalendarItemResizeEndPayload = {
  itemId: string;
  itemKind: CalendarItemKind;
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
  type: "calendar-item";
  itemId: string;
  itemKind: CalendarItemKind;
  start: Date;
  end: Date;
};

export type CalendarDropData = {
  type: "day-column";
  day: Date;
};
