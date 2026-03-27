import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const locationwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => LocationWhereInputObjectSchema), z.lazy(() => LocationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LocationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LocationWhereInputObjectSchema), z.lazy(() => LocationWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  street: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  city: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  zipCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  longitude: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  latitude: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const LocationWhereInputObjectSchema: z.ZodType<Prisma.LocationWhereInput> = locationwhereinputSchema as unknown as z.ZodType<Prisma.LocationWhereInput>;
export const LocationWhereInputObjectZodSchema = locationwhereinputSchema;
