import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema'

const registrationwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RegistrationWhereInputObjectSchema), z.lazy(() => RegistrationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RegistrationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RegistrationWhereInputObjectSchema), z.lazy(() => RegistrationWhereInputObjectSchema).array()]).optional(),
  firstName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lastName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
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
export const RegistrationWhereInputObjectSchema: z.ZodType<Prisma.RegistrationWhereInput> = registrationwhereinputSchema as unknown as z.ZodType<Prisma.RegistrationWhereInput>;
export const RegistrationWhereInputObjectZodSchema = registrationwhereinputSchema;
