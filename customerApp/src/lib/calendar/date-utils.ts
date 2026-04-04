import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

/**
 * Checks if two dates are on the same day.
 * @param a - First date to compare.
 * @param b - Second date to compare.
 * @returns - True if both dates are on the same calendar day, false otherwise.
 */
export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Calculates the number of minutes that have passed since the start of the day for a given date.
 * @param date - The date for which to calculate the minutes since the start of the day.
 * @returns - The total number of minutes since the start of the day (0 to 1439).
 */
export function getMinutesSinceStartOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Returns the days of the week for a given date.
 * @param currentDate - The date for which to calculate the week days.
 * @returns - An array of dates representing the days of the week.
 */
export function getWeekDays(currentDate: Date) {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

/**
 * Creates a new Date object based on the provided day, hour, and optional minutes.
 * @param day - The base date to which the time will be added.
 * @param hour - The hour to set on the new date (0-23).
 * @param minutes - The minutes to set on the new date (0-59). Defaults to 0 if not provided.
 * @returns - A new Date object with the specified day, hour, and minutes.
 */
export function createDateWithTime(day: Date, hour: number, minutes = 0) {
  const nextDate = new Date(day);
  nextDate.setHours(hour, minutes, 0, 0);
  return nextDate;
}

/**
 * Checks if two time ranges overlap.
 * @param rangeAStart - The start time of the first range.
 * @param rangeAEnd - The end time of the first range.
 * @param rangeBStart - The start time of the second range.
 * @param rangeBEnd - The end time of the second range.
 * @returns - True if the two ranges overlap, false otherwise.
 */
export function rangesOverlap(
  rangeAStart: Date,
  rangeAEnd: Date,
  rangeBStart: Date,
  rangeBEnd: Date,
) {
  return rangeAStart < rangeBEnd && rangeBStart < rangeAEnd;
}

/**
 * Normalizes a time range by ensuring that the start date is before the end date. If the provided start date is after the end date, they will be swapped.
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @returns - An object containing the normalized start and end dates, where start is always less than or equal to end.
 */
export function normalizeRange(start: Date, end: Date) {
  if (start <= end) {
    return { start, end };
  }

  return { start: end, end: start };
}

/**
 * Adds a specified number of minutes to a given date and returns the new date.
 * @param date - The original date to which minutes will be added.
 * @param minutes - The number of minutes to add to the date. Can be positive or negative.
 * @returns - A new Date object that represents the original date plus the specified number of minutes.
 */
export function addMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Calculates the difference in minutes between two dates. The result is positive if laterDate is after earlierDate, and negative if laterDate is before earlierDate.
 * @param laterDate - The date that is being compared as the later time.
 * @param earlierDate - The date that is being compared as the earlier time.
 * @returns - The difference in minutes between laterDate and earlierDate. Positive if laterDate is after earlierDate, negative if laterDate is before earlierDate.
 */
export function getDifferenceInMinutes(laterDate: Date, earlierDate: Date) {
  return Math.round((laterDate.getTime() - earlierDate.getTime()) / (60 * 1000));
}
