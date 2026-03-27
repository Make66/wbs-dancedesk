import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const customerwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CustomerWhereInputObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CustomerWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CustomerWhereInputObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  website: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  logoUrl: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  primary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  secondary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tertiary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quaternary: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
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
export const CustomerWhereInputObjectSchema: z.ZodType<Prisma.CustomerWhereInput> = customerwhereinputSchema as unknown as z.ZodType<Prisma.CustomerWhereInput>;
export const CustomerWhereInputObjectZodSchema = customerwhereinputSchema;
