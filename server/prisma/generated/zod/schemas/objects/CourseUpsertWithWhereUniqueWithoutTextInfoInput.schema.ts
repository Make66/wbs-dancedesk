import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutTextInfoInputObjectSchema as CourseUpdateWithoutTextInfoInputObjectSchema } from './CourseUpdateWithoutTextInfoInput.schema';
import { CourseUncheckedUpdateWithoutTextInfoInputObjectSchema as CourseUncheckedUpdateWithoutTextInfoInputObjectSchema } from './CourseUncheckedUpdateWithoutTextInfoInput.schema';
import { CourseCreateWithoutTextInfoInputObjectSchema as CourseCreateWithoutTextInfoInputObjectSchema } from './CourseCreateWithoutTextInfoInput.schema';
import { CourseUncheckedCreateWithoutTextInfoInputObjectSchema as CourseUncheckedCreateWithoutTextInfoInputObjectSchema } from './CourseUncheckedCreateWithoutTextInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseUpdateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutTextInfoInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema)])
}).strict();
export const CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectSchema: z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutTextInfoInput>;
export const CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectZodSchema = makeSchema();
