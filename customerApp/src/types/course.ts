export type PaymentType = "cash" | "paypal" | "card" | "transfer";

export type ContractType = "monthly" | "one-time" | "subscription";

export type CourseFrequency = "daily" | "weekly" | "monthly";

export type CourseTarget = {
  id: string;
  seq: number;
  name: string;
  color: string;
  isActive: boolean;
};

export type Course = {
  id: string;
  seq: number;
  name: string;
  description: string;
  startsAt: string;
  repeat: number;
  frequency: CourseFrequency;
  seatsCurrent: number;
  seatsMax: number;
  paymentTypes: PaymentType[];
  contractTypes: ContractType[];
  price: number;
  duration: number;
};

export type CourseCategory = {
  id: string;
  seq: number;
  name: string;
  courses: Course[];
  color: string;
};

export type CourseTargetDetail = {
  id: string;
  name: string;
  color: string;
  categories: CourseCategory[];
};
