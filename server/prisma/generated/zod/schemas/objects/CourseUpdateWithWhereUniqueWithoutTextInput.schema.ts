import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextInputObjectSchema as CourseUpdateWithoutTextInputObjectSchema } from './CourseUpdateWithoutTextInput.schema';
import { CourseUncheckedUpdateWithoutTextInputObjectSchema as CourseUncheckedUpdateWithoutTextInputObjectSchema } from './CourseUncheckedUpdateWithoutTextInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextInputObjectSchema)])
}).strict();
export const CourseUpdateWithWhereUniqueWithoutTextInputObjectSchema: z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutTextInput>;
export const CourseUpdateWithWhereUniqueWithoutTextInputObjectZodSchema = makeSchema();
