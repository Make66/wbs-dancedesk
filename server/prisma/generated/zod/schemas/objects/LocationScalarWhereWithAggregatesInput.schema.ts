import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const locationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  active: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  street: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  city: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  zipCode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  longitude: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  latitude: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const LocationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = locationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput>;
export const LocationScalarWhereWithAggregatesInputObjectZodSchema = locationscalarwherewithaggregatesinputSchema;
