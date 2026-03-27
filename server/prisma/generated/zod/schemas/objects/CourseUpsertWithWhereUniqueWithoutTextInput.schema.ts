import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextInputObjectSchema as CourseUpdateWithoutTextInputObjectSchema } from './CourseUpdateWithoutTextInput.schema';
import { CourseUncheckedUpdateWithoutTextInputObjectSchema as CourseUncheckedUpdateWithoutTextInputObjectSchema } from './CourseUncheckedUpdateWithoutTextInput.schema';
import { CourseCreateWithoutTextInputObjectSchema as CourseCreateWithoutTextInputObjectSchema } from './CourseCreateWithoutTextInput.schema';
import { CourseUncheckedCreateWithoutTextInputObjectSchema as CourseUncheckedCreateWithoutTextInputObjectSchema } from './CourseUncheckedCreateWithoutTextInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseUpdateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseCreateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema)])
}).strict();
export const CourseUpsertWithWhereUniqueWithoutTextInputObjectSchema: z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextInput>;
export const CourseUpsertWithWhereUniqueWithoutTextInputObjectZodSchema = makeSchema();
