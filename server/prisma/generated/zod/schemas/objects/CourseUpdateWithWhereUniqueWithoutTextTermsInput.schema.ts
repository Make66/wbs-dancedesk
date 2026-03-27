import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextTermsInputObjectSchema as CourseUpdateWithoutTextTermsInputObjectSchema } from './CourseUpdateWithoutTextTermsInput.schema';
import { CourseUncheckedUpdateWithoutTextTermsInputObjectSchema as CourseUncheckedUpdateWithoutTextTermsInputObjectSchema } from './CourseUncheckedUpdateWithoutTextTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextTermsInputObjectSchema)])
}).strict();
export const CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextTermsInput>;
export const CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectZodSchema = makeSchema();
