import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateNestedManyWithoutTextTermsInputObjectSchema as CourseCreateNestedManyWithoutTextTermsInputObjectSchema } from './CourseCreateNestedManyWithoutTextTermsInput.schema';
import { CourseCreateNestedManyWithoutTextInfoInputObjectSchema as CourseCreateNestedManyWithoutTextInfoInputObjectSchema } from './CourseCreateNestedManyWithoutTextInfoInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  type: z.number().int().optional(),
  text: z.string().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  courseTerms: z.lazy(() => CourseCreateNestedManyWithoutTextTermsInputObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseCreateNestedManyWithoutTextInfoInputObjectSchema).optional()
}).strict();
export const TextCreateWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextCreateWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateWithoutCoursesInput>;
export const TextCreateWithoutCoursesInputObjectZodSchema = makeSchema();
