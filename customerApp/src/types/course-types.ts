export type CourseFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
export type PaymentType = "cash" | "bank" | "direct" | "paypal";
export type ContractType = "one-time" | "subscription" | "trial" | "standard";

export type Target = {
  name: string;
  description: string;
  icon: string;
  color: string[];
  isActive: boolean;
  setSeqCategory: string[];
  locationId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isNew?: boolean;
};

export type Contract = {
  title: string;
  amount: number;
  installments: number;
  autoEnd: boolean;
  paymentTypes: PaymentType[];
  isActive: boolean;
};

export type BaseEntity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export type SortableEntity = {
  seq: number;
};

export type ActivatableEntity = {
  isActive?: boolean;
};

export type Course = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  frequency: CourseFrequency;
  clubRepetition?: number;
  courseRepetition?: number;
  seatsCurrent: number;
  seatsMax: number;
  contracts: Contract[];
  price?: number;
  duration?: number;
  options?: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  color?: string[];
  isBookedOut?: boolean;
  isClub?: boolean;
  isIgnoreCalendar?: boolean;
  isTaxFree?: boolean;
  dates?: {
    date: string;
    isStart: boolean;
  }[];
  instructorId?: string | null;
  roomId?: string | null;
  textTermsId?: string | null;
  textInfoId?: string | null;
  tenantId?: string;
};

export type CreateCourseInput = {
  name: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  frequency: CourseFrequency;
  clubRepetition?: number;
  courseRepetition?: number;
  seatsCurrent?: number;
  seatsMax: number;
  categoryId?: string;
  instructorId?: string | null;
  roomId?: string | null;
  isIgnoreCalendar?: boolean;
  isTaxFree?: boolean;
  options?: number;
};

export type UpdateCourseInput = {
  name?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  frequency?: CourseFrequency;
  clubRepetition?: number;
  courseRepetition?: number;
  seatsCurrent?: number;
  seatsMax?: number;
  paymentTypes?: PaymentType[];
  contractTypes?: ContractType[];
  isActive?: boolean;
  isDeleted?: boolean;
  instructorId?: string | null;
  roomId?: string | null;
  textTermsId?: string | null;
  textInfoId?: string | null;
  isIgnoreCalendar?: boolean;
  isTaxFree?: boolean;
  price?: number;
  options?: number;
};

export type Category = {
  id: string;
  targetId: string;
  name: string;
  description?: string;
  icon?: string;
  color: string[];
  fontColor?: string;
  courses: Course[];
  setSeqCourse: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
};

export type TargetDetail = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: Category[];
  setSeqCategories: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateTargetInput = {
  name?: string;
  description?: string;
  color?: string[];
  icon?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  setSeqCategory?: string[];
};

export type CreateTargetInput = {
  name?: string;
  description?: string;
  color?: string[];
  icon?: string;
  locationId: string;
  isActive?: boolean;
  setSeqCategory?: string[];
};

export type CreateCategoryInput = {
  targetId: string;
  isActive?: boolean;
  name?: string;
  icon?: string;
  color?: string[];
  description?: string;
};

export type UpdateCategoryInput = {
  id?: string;
  name?: string;
  color?: string[];
  icon?: string;
  isActive?: boolean;
  description?: string;
};
