import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextInfoInputObjectSchema as CourseUpdateWithoutTextInfoInputObjectSchema } from './CourseUpdateWithoutTextInfoInput.schema';
import { CourseUncheckedUpdateWithoutTextInfoInputObjectSchema as CourseUncheckedUpdateWithoutTextInfoInputObjectSchema } from './CourseUncheckedUpdateWithoutTextInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextInfoInputObjectSchema)])
}).strict();
export const CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectSchema: z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextInfoInput>;
export const CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectZodSchema = makeSchema();
