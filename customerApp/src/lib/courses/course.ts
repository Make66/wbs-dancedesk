import { parseISO, differenceInMinutes } from "date-fns";
import type { Course } from "../../types/course-types";

export const getCourseDuration = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);

  const minutes = differenceInMinutes(endDate, startDate);

  return minutes;
};

export const findNextCourseDate = (course?: Course): Date | null => {
  if (!course?.dates?.length) {
    return null;
  }

  const today = new Date();

  const futureDates = course.dates
    .map((item) => new Date(item.date))
    .filter((date) => date >= today);

  if (futureDates.length === 0) {
    return null;
  }

  return futureDates.reduce((earliest, current) => (current < earliest ? current : earliest));
};
