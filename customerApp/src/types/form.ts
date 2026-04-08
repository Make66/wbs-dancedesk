import type { Contract } from "./course-types";

export type CourseFormValues = {
  name: string;
  description?: string;
  contracts?: Contract[];
  startsAt?: Date | undefined;
  endsAt?: Date | undefined;
  frequency?: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
  isClub?: boolean;
  courseRepetition?: number;
  clubRepetition?: number;
  isIgnoreCalendar?: boolean;
  dates?: {
    date: string;
    isStart: boolean;
  }[];
  isTaxFree?: boolean;
  isBookedOut?: boolean;
  seatsMax?: number;
  seatsCurrent?: number;
  color?: [string, string];
};
