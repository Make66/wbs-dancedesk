import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CourseCountOrderByAggregateInputObjectSchema as CourseCountOrderByAggregateInputObjectSchema } from './CourseCountOrderByAggregateInput.schema';
import { CourseAvgOrderByAggregateInputObjectSchema as CourseAvgOrderByAggregateInputObjectSchema } from './CourseAvgOrderByAggregateInput.schema';
import { CourseMaxOrderByAggregateInputObjectSchema as CourseMaxOrderByAggregateInputObjectSchema } from './CourseMaxOrderByAggregateInput.schema';
import { CourseMinOrderByAggregateInputObjectSchema as CourseMinOrderByAggregateInputObjectSchema } from './CourseMinOrderByAggregateInput.schema';
import { CourseSumOrderByAggregateInputObjectSchema as CourseSumOrderByAggregateInputObjectSchema } from './CourseSumOrderByAggregateInput.schema'

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
  _count: z.lazy(() => CourseCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CourseAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CourseMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CourseMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CourseSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CourseOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CourseOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseOrderByWithAggregationInput>;
export const CourseOrderByWithAggregationInputObjectZodSchema = makeSchema();
