import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  name: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  startsAt: SortOrderSchema.optional(),
  endsAt: SortOrderSchema.optional(),
  repeat: SortOrderSchema.optional(),
  frequency: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  isIgnoreCalendar: SortOrderSchema.optional(),
  dates: SortOrderSchema.optional(),
  seatsCurrent: SortOrderSchema.optional(),
  seatsMax: SortOrderSchema.optional(),
  paymentTypes: SortOrderSchema.optional(),
  contractTypes: SortOrderSchema.optional(),
  instructorId: SortOrderSchema.optional(),
  textTermsId: SortOrderSchema.optional(),
  textInfoId: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  textId: SortOrderSchema.optional()
}).strict();
export const CourseCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CourseCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCountOrderByAggregateInput>;
export const CourseCountOrderByAggregateInputObjectZodSchema = makeSchema();
