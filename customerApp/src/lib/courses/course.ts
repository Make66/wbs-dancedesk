import type { Course } from "../../types/course-types";

export const getCourseDuration = (start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / 1000 / 60); // Minuten
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
