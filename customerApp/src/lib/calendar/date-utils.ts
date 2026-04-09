import {
  differenceInYears,
  eachDayOfInterval,
  endOfWeek,
  format,
  getISOWeek,
  startOfWeek,
} from "date-fns";
import { de } from "date-fns/locale";
import type { CalendarHeaderDisplayData, CalendarView } from "../../types/calendar-types";

/**
 * Checks if two dates are on the same day.
 */
export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getMinutesSinceStartOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function getWeekDays(currentDate: Date) {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function createDateWithTime(day: Date, hour: number, minutes = 0) {
  const nextDate = new Date(day);
  nextDate.setHours(hour, minutes, 0, 0);
  return nextDate;
}

export function rangesOverlap(
  rangeAStart: Date,
  rangeAEnd: Date,
  rangeBStart: Date,
  rangeBEnd: Date,
) {
  return rangeAStart < rangeBEnd && rangeBStart < rangeAEnd;
}

export function normalizeRange(start: Date, end: Date) {
  if (start <= end) {
    return { start, end };
  }

  return { start: end, end: start };
}

export function addMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function getDifferenceInMinutes(laterDate: Date, earlierDate: Date) {
  return Math.round((laterDate.getTime() - earlierDate.getTime()) / (60 * 1000));
}

export function getDayHeaderDisplayData(date: Date): CalendarHeaderDisplayData {
  const today = new Date();

  return {
    monthLabel: format(date, "MMMM yyyy", { locale: de }),
    rangeLabel: format(date, "dd. MMMM yyyy", { locale: de }),
    todayMonthLabel: format(today, "LLL", { locale: de }).toUpperCase(),
    todayDayLabel: format(today, "dd", { locale: de }),
  };
}

export function getWeekHeaderDisplayData(days: Date[]): CalendarHeaderDisplayData {
  const today = new Date();

  return {
    monthLabel: format(days[0], "MMMM yyyy", { locale: de }),
    weekLabel: `${getISOWeek(days[0])} KW`,
    rangeLabel: `${format(days[0], "dd. MMMM yyyy", { locale: de })} - ${format(days[days.length - 1], "dd. MMMM yyyy", { locale: de })}`,
    todayMonthLabel: format(today, "LLL", { locale: de }).toUpperCase(),
    todayDayLabel: format(today, "dd", { locale: de }),
  };
}

export function getMonthHeaderDisplayData(date: Date): CalendarHeaderDisplayData {
  const today = new Date();

  return {
    monthLabel: format(date, "MMMM yyyy", { locale: de }),
    todayMonthLabel: format(today, "LLL", { locale: de }).toUpperCase(),
    todayDayLabel: format(today, "dd", { locale: de }),
  };
}

export function getCalendarHeaderDisplayData(
  currentView: CalendarView,
  currentDate: Date,
): CalendarHeaderDisplayData {
  if (currentView === "day") {
    return getDayHeaderDisplayData(currentDate);
  }

  if (currentView === "month") {
    return getMonthHeaderDisplayData(currentDate);
  }

  return getWeekHeaderDisplayData(getWeekDays(currentDate));
}

export function calculateAge(birthdate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthdate));
}
