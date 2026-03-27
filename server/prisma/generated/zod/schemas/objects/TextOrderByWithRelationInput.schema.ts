import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CourseOrderByRelationAggregateInputObjectSchema as CourseOrderByRelationAggregateInputObjectSchema } from './CourseOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  text: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  courseTerms: z.lazy(() => CourseOrderByRelationAggregateInputObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseOrderByRelationAggregateInputObjectSchema).optional(),
  courses: z.lazy(() => CourseOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TextOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TextOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TextOrderByWithRelationInput>;
export const TextOrderByWithRelationInputObjectZodSchema = makeSchema();
