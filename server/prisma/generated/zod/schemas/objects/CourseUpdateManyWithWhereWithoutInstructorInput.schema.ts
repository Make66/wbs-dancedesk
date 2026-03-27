import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './CourseUpdateManyMutationInput.schema';
import { CourseUncheckedUpdateManyWithoutInstructorInputObjectSchema as CourseUncheckedUpdateManyWithoutInstructorInputObjectSchema } from './CourseUncheckedUpdateManyWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateManyMutationInputObjectSchema), z.lazy(() => CourseUncheckedUpdateManyWithoutInstructorInputObjectSchema)])
}).strict();
export const CourseUpdateManyWithWhereWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutInstructorInput>;
export const CourseUpdateManyWithWhereWithoutInstructorInputObjectZodSchema = makeSchema();
