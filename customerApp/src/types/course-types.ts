export type PaymentType = "cash" | "paypal" | "card" | "transfer";

export type ContractType = "monthly" | "one-time" | "subscription";

export type CourseFrequency = "daily" | "weekly" | "monthly";

export type Target = {
  name: string;
  icon: string;
  color: string[];
  active: boolean;
  setSeqCategory: Record<string, unknown>;
  locationId: string;
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isNew?: boolean;
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

export type Category = {
  id: string;
  seq: number;
  name: string;
  courses: Course[];
  color: string;
};

export type TargetDetail = {
  id: string;
  name: string;
  color: string;
  categories: Category[];
};
