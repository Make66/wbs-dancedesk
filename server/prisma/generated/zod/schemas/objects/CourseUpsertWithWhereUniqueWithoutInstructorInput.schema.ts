import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutInstructorInputObjectSchema as CourseUpdateWithoutInstructorInputObjectSchema } from './CourseUpdateWithoutInstructorInput.schema';
import { CourseUncheckedUpdateWithoutInstructorInputObjectSchema as CourseUncheckedUpdateWithoutInstructorInputObjectSchema } from './CourseUncheckedUpdateWithoutInstructorInput.schema';
import { CourseCreateWithoutInstructorInputObjectSchema as CourseCreateWithoutInstructorInputObjectSchema } from './CourseCreateWithoutInstructorInput.schema';
import { CourseUncheckedCreateWithoutInstructorInputObjectSchema as CourseUncheckedCreateWithoutInstructorInputObjectSchema } from './CourseUncheckedCreateWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseUpdateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutInstructorInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema)])
}).strict();
export const CourseUpsertWithWhereUniqueWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpsertWithWhereUniqueWithoutInstructorInput>;
export const CourseUpsertWithWhereUniqueWithoutInstructorInputObjectZodSchema = makeSchema();
