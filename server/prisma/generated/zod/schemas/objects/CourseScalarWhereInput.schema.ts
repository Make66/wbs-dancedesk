import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema'

const coursescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CourseScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  categoryId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  startsAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  endsAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  repeat: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  frequency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  roomId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isIgnoreCalendar: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  dates: z.lazy(() => JsonFilterObjectSchema).optional(),
  seatsCurrent: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  seatsMax: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  paymentTypes: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  contractTypes: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  instructorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  textTermsId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  textInfoId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  textId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const CourseScalarWhereInputObjectSchema: z.ZodType<Prisma.CourseScalarWhereInput> = coursescalarwhereinputSchema as unknown as z.ZodType<Prisma.CourseScalarWhereInput>;
export const CourseScalarWhereInputObjectZodSchema = coursescalarwhereinputSchema;
