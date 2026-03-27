import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './CourseUpdateManyMutationInput.schema';
import { CourseUncheckedUpdateManyWithoutTextInfoInputObjectSchema as CourseUncheckedUpdateManyWithoutTextInfoInputObjectSchema } from './CourseUncheckedUpdateManyWithoutTextInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateManyMutationInputObjectSchema), z.lazy(() => CourseUncheckedUpdateManyWithoutTextInfoInputObjectSchema)])
}).strict();
export const CourseUpdateManyWithWhereWithoutTextInfoInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextInfoInput>;
export const CourseUpdateManyWithWhereWithoutTextInfoInputObjectZodSchema = makeSchema();
