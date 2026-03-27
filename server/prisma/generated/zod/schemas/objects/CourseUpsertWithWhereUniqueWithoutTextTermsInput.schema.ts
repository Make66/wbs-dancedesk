import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextTermsInputObjectSchema as CourseUpdateWithoutTextTermsInputObjectSchema } from './CourseUpdateWithoutTextTermsInput.schema';
import { CourseUncheckedUpdateWithoutTextTermsInputObjectSchema as CourseUncheckedUpdateWithoutTextTermsInputObjectSchema } from './CourseUncheckedUpdateWithoutTextTermsInput.schema';
import { CourseCreateWithoutTextTermsInputObjectSchema as CourseCreateWithoutTextTermsInputObjectSchema } from './CourseCreateWithoutTextTermsInput.schema';
import { CourseUncheckedCreateWithoutTextTermsInputObjectSchema as CourseUncheckedCreateWithoutTextTermsInputObjectSchema } from './CourseUncheckedCreateWithoutTextTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseUpdateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextTermsInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema)])
}).strict();
export const CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextTermsInput>;
export const CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectZodSchema = makeSchema();
