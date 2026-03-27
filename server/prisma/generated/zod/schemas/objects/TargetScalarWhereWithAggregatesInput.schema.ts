import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const targetscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TargetScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  icon: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  color: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  active: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const TargetScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TargetScalarWhereWithAggregatesInput> = targetscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TargetScalarWhereWithAggregatesInput>;
export const TargetScalarWhereWithAggregatesInputObjectZodSchema = targetscalarwherewithaggregatesinputSchema;
