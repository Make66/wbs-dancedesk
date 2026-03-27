import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './CourseUpdateManyMutationInput.schema';
import { CourseUncheckedUpdateManyWithoutTextTermsInputObjectSchema as CourseUncheckedUpdateManyWithoutTextTermsInputObjectSchema } from './CourseUncheckedUpdateManyWithoutTextTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateManyMutationInputObjectSchema), z.lazy(() => CourseUncheckedUpdateManyWithoutTextTermsInputObjectSchema)])
}).strict();
export const CourseUpdateManyWithWhereWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextTermsInput>;
export const CourseUpdateManyWithWhereWithoutTextTermsInputObjectZodSchema = makeSchema();
