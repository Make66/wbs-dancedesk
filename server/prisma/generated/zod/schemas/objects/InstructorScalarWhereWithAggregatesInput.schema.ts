import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const instructorscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => InstructorScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InstructorScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InstructorScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InstructorScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InstructorScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  active: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const InstructorScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.InstructorScalarWhereWithAggregatesInput> = instructorscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.InstructorScalarWhereWithAggregatesInput>;
export const InstructorScalarWhereWithAggregatesInputObjectZodSchema = instructorscalarwherewithaggregatesinputSchema;
