import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CourseOrderByRelationAggregateInputObjectSchema as CourseOrderByRelationAggregateInputObjectSchema } from './CourseOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageUrl: SortOrderSchema.optional(),
  active: SortOrderSchema.optional(),
  id: SortOrderSchema.optional(),
  tenantId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  isDeleted: SortOrderSchema.optional(),
  courses: z.lazy(() => CourseOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const InstructorOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.InstructorOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorOrderByWithRelationInput>;
export const InstructorOrderByWithRelationInputObjectZodSchema = makeSchema();
