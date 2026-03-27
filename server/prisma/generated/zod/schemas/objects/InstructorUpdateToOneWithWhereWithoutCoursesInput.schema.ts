import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './InstructorWhereInput.schema';
import { InstructorUpdateWithoutCoursesInputObjectSchema as InstructorUpdateWithoutCoursesInputObjectSchema } from './InstructorUpdateWithoutCoursesInput.schema';
import { InstructorUncheckedUpdateWithoutCoursesInputObjectSchema as InstructorUncheckedUpdateWithoutCoursesInputObjectSchema } from './InstructorUncheckedUpdateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InstructorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => InstructorUpdateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedUpdateWithoutCoursesInputObjectSchema)])
}).strict();
export const InstructorUpdateToOneWithWhereWithoutCoursesInputObjectSchema: z.ZodType<Prisma.InstructorUpdateToOneWithWhereWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorUpdateToOneWithWhereWithoutCoursesInput>;
export const InstructorUpdateToOneWithWhereWithoutCoursesInputObjectZodSchema = makeSchema();
