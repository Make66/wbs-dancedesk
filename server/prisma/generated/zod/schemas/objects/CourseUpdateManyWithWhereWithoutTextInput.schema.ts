import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema';
import { CourseUpdateManyMutationInputObjectSchema as CourseUpdateManyMutationInputObjectSchema } from './CourseUpdateManyMutationInput.schema';
import { CourseUncheckedUpdateManyWithoutTextInputObjectSchema as CourseUncheckedUpdateManyWithoutTextInputObjectSchema } from './CourseUncheckedUpdateManyWithoutTextInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseUpdateManyMutationInputObjectSchema), z.lazy(() => CourseUncheckedUpdateManyWithoutTextInputObjectSchema)])
}).strict();
export const CourseUpdateManyWithWhereWithoutTextInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithWhereWithoutTextInput>;
export const CourseUpdateManyWithWhereWithoutTextInputObjectZodSchema = makeSchema();
