import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithoutInstructorInputObjectSchema as CourseUpdateWithoutInstructorInputObjectSchema } from './CourseUpdateWithoutInstructorInput.schema';
import { CourseUncheckedUpdateWithoutInstructorInputObjectSchema as CourseUncheckedUpdateWithoutInstructorInputObjectSchema } from './CourseUncheckedUpdateWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedUpdateWithoutInstructorInputObjectSchema)])
}).strict();
export const CourseUpdateWithWhereUniqueWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateWithWhereUniqueWithoutInstructorInput>;
export const CourseUpdateWithWhereUniqueWithoutInstructorInputObjectZodSchema = makeSchema();
