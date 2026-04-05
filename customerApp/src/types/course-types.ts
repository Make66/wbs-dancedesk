export type CourseFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type PaymentType = "cash" | "invoice" | "paypal";
export type ContractType = "one-time" | "subscription" | "trial";

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
  repeat?: number;
  frequency?: CourseFrequency;
  seatsCurrent: number;
  seatsMax: number;
  paymentTypes?: PaymentType[];
  contractTypes?: ContractType[];
  price: number;
  duration: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  color?: string[];
  isBookedOut?: boolean;
  isClub?: boolean;
};

export type CreateCourseInput = {
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
  categoryId: string;
};

export type UpdateCourseInput = {
  name?: string;
  description?: string;
  startsAt?: string;
  repeat?: number;
  frequency?: CourseFrequency;
  seatsCurrent?: number;
  seatsMax?: number;
  paymentTypes?: PaymentType[];
  contractTypes?: ContractType[];
  price?: number;
  duration?: number;
  isActive?: boolean;
  isDeleted?: boolean;
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
