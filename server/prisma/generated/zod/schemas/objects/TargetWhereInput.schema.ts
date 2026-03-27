import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const targetwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TargetWhereInputObjectSchema), z.lazy(() => TargetWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TargetWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TargetWhereInputObjectSchema), z.lazy(() => TargetWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  icon: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  color: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const TargetWhereInputObjectSchema: z.ZodType<Prisma.TargetWhereInput> = targetwhereinputSchema as unknown as z.ZodType<Prisma.TargetWhereInput>;
export const TargetWhereInputObjectZodSchema = targetwhereinputSchema;
