import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const roomscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => RoomScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoomScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  capacity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  active: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const RoomScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RoomScalarWhereWithAggregatesInput> = roomscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.RoomScalarWhereWithAggregatesInput>;
export const RoomScalarWhereWithAggregatesInputObjectZodSchema = roomscalarwherewithaggregatesinputSchema;
