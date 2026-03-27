import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema'

const textscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TextScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TextScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TextScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TextScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TextScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  text: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const TextScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TextScalarWhereWithAggregatesInput> = textscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TextScalarWhereWithAggregatesInput>;
export const TextScalarWhereWithAggregatesInputObjectZodSchema = textscalarwherewithaggregatesinputSchema;
