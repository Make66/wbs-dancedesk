import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CourseListRelationFilterObjectSchema as CourseListRelationFilterObjectSchema } from './CourseListRelationFilter.schema'

const instructorwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => InstructorWhereInputObjectSchema), z.lazy(() => InstructorWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InstructorWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InstructorWhereInputObjectSchema), z.lazy(() => InstructorWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  courses: z.lazy(() => CourseListRelationFilterObjectSchema).optional()
}).strict();
export const InstructorWhereInputObjectSchema: z.ZodType<Prisma.InstructorWhereInput> = instructorwhereinputSchema as unknown as z.ZodType<Prisma.InstructorWhereInput>;
export const InstructorWhereInputObjectZodSchema = instructorwhereinputSchema;
