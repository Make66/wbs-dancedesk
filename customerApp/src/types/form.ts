import type { PaymentType } from "./course-types";

export type CourseFormValues = {
  name: string;
  description?: string;
  contracts?: {
    title: string;
    amount: number;
    installments: number;
    endsAutomatically: boolean;
    paymentTypes: PaymentType[];
    isActive: boolean;
  }[];
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
  isTaxFree?: boolean;
  isBookedOut?: boolean;
  seatsMax?: number;
};
