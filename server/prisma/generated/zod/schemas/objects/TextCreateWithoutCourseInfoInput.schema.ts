import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateNestedManyWithoutTextTermsInputObjectSchema as CourseCreateNestedManyWithoutTextTermsInputObjectSchema } from './CourseCreateNestedManyWithoutTextTermsInput.schema';
import { CourseCreateNestedManyWithoutTextInputObjectSchema as CourseCreateNestedManyWithoutTextInputObjectSchema } from './CourseCreateNestedManyWithoutTextInput.schema'

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
  courses: z.lazy(() => CourseCreateNestedManyWithoutTextInputObjectSchema).optional()
}).strict();
export const TextCreateWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextCreateWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateWithoutCourseInfoInput>;
export const TextCreateWithoutCourseInfoInputObjectZodSchema = makeSchema();
