import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateNestedManyWithoutTextTermsInputObjectSchema as CourseCreateNestedManyWithoutTextTermsInputObjectSchema } from './CourseCreateNestedManyWithoutTextTermsInput.schema';
import { CourseCreateNestedManyWithoutTextInfoInputObjectSchema as CourseCreateNestedManyWithoutTextInfoInputObjectSchema } from './CourseCreateNestedManyWithoutTextInfoInput.schema';
import { CourseCreateNestedManyWithoutTextInputObjectSchema as CourseCreateNestedManyWithoutTextInputObjectSchema } from './CourseCreateNestedManyWithoutTextInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  type: z.number().int().optional(),
  text: z.string().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  courseTerms: z.lazy(() => CourseCreateNestedManyWithoutTextTermsInputObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseCreateNestedManyWithoutTextInfoInputObjectSchema).optional(),
  courses: z.lazy(() => CourseCreateNestedManyWithoutTextInputObjectSchema).optional()
}).strict();
export const TextCreateInputObjectSchema: z.ZodType<Prisma.TextCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateInput>;
export const TextCreateInputObjectZodSchema = makeSchema();
