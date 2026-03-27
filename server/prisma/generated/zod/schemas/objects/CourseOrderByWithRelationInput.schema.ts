import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InstructorOrderByWithRelationInputObjectSchema as InstructorOrderByWithRelationInputObjectSchema } from './InstructorOrderByWithRelationInput.schema';
import { TextOrderByWithRelationInputObjectSchema as TextOrderByWithRelationInputObjectSchema } from './TextOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  categoryId: SortOrderSchema.optional(),
  seq: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  startsAt: SortOrderSchema.optional(),
  endsAt: SortOrderSchema.optional(),
  repeat: SortOrderSchema.optional(),
  frequency: SortOrderSchema.optional(),
  roomId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isIgnoreCalendar: SortOrderSchema.optional(),
  dates: SortOrderSchema.optional(),
  seatsCurrent: SortOrderSchema.optional(),
  seatsMax: SortOrderSchema.optional(),
  paymentTypes: SortOrderSchema.optional(),
  contractTypes: SortOrderSchema.optional(),
  instructorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  textTermsId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  textInfoId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  textId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  instructor: z.lazy(() => InstructorOrderByWithRelationInputObjectSchema).optional(),
  textTerms: z.lazy(() => TextOrderByWithRelationInputObjectSchema).optional(),
  textInfo: z.lazy(() => TextOrderByWithRelationInputObjectSchema).optional(),
  text: z.lazy(() => TextOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CourseOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CourseOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseOrderByWithRelationInput>;
export const CourseOrderByWithRelationInputObjectZodSchema = makeSchema();
