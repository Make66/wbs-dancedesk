import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseUncheckedCreateNestedManyWithoutTextTermsInputObjectSchema as CourseUncheckedCreateNestedManyWithoutTextTermsInputObjectSchema } from './CourseUncheckedCreateNestedManyWithoutTextTermsInput.schema';
import { CourseUncheckedCreateNestedManyWithoutTextInfoInputObjectSchema as CourseUncheckedCreateNestedManyWithoutTextInfoInputObjectSchema } from './CourseUncheckedCreateNestedManyWithoutTextInfoInput.schema';
import { CourseUncheckedCreateNestedManyWithoutTextInputObjectSchema as CourseUncheckedCreateNestedManyWithoutTextInputObjectSchema } from './CourseUncheckedCreateNestedManyWithoutTextInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  type: z.number().int().optional(),
  text: z.string().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional(),
  courseTerms: z.lazy(() => CourseUncheckedCreateNestedManyWithoutTextTermsInputObjectSchema).optional(),
  courseInfo: z.lazy(() => CourseUncheckedCreateNestedManyWithoutTextInfoInputObjectSchema).optional(),
  courses: z.lazy(() => CourseUncheckedCreateNestedManyWithoutTextInputObjectSchema).optional()
}).strict();
export const TextUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TextUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUncheckedCreateInput>;
export const TextUncheckedCreateInputObjectZodSchema = makeSchema();
