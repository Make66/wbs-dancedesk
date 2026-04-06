export type CourseFormValues = {
  name: string;
  description?: string;
  paymentTypes?: unknown[];
  contractTypes?: unknown[];
  startsAt?: Date | undefined;
  endsAt?: Date | undefined;
  frequency?: string;
  isClub?: boolean;
  courseRepetition?: number;
  clubRepetition?: number;
  isIgnoreCalendar?: boolean;
  dates?: {
    date: string;
    isStart: boolean;
  }[];
};
