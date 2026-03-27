import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { CourseListRelationFilterObjectSchema as CourseListRelationFilterObjectSchema } from './CourseListRelationFilter.schema'

const textwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TextWhereInputObjectSchema), z.lazy(() => TextWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TextWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TextWhereInputObjectSchema), z.lazy(() => TextWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  text: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  courseTerms: z.lazy(() => CourseListRelationFilterObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseListRelationFilterObjectSchema).optional(),
  courses: z.lazy(() => CourseListRelationFilterObjectSchema).optional()
}).strict();
export const TextWhereInputObjectSchema: z.ZodType<Prisma.TextWhereInput> = textwhereinputSchema as unknown as z.ZodType<Prisma.TextWhereInput>;
export const TextWhereInputObjectZodSchema = textwhereinputSchema;
