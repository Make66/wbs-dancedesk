export type PaymentType = "cash" | "paypal" | "card" | "transfer";

export type ContractType = "monthly" | "one-time" | "subscription";

export type CourseFrequency = "daily" | "weekly" | "monthly";

export type Target = {
  id: string;
  name: string;
  seq: number;
  color: string[];
  icon: string;
  active: boolean;
  locationId: string;
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
