import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorUpdateWithoutCoursesInputObjectSchema as InstructorUpdateWithoutCoursesInputObjectSchema } from './InstructorUpdateWithoutCoursesInput.schema';
import { InstructorUncheckedUpdateWithoutCoursesInputObjectSchema as InstructorUncheckedUpdateWithoutCoursesInputObjectSchema } from './InstructorUncheckedUpdateWithoutCoursesInput.schema';
import { InstructorCreateWithoutCoursesInputObjectSchema as InstructorCreateWithoutCoursesInputObjectSchema } from './InstructorCreateWithoutCoursesInput.schema';
import { InstructorUncheckedCreateWithoutCoursesInputObjectSchema as InstructorUncheckedCreateWithoutCoursesInputObjectSchema } from './InstructorUncheckedCreateWithoutCoursesInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './InstructorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => InstructorUpdateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedUpdateWithoutCoursesInputObjectSchema)]),
  create: z.union([z.lazy(() => InstructorCreateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedCreateWithoutCoursesInputObjectSchema)]),
  where: z.lazy(() => InstructorWhereInputObjectSchema).optional()
}).strict();
export const InstructorUpsertWithoutCoursesInputObjectSchema: z.ZodType<Prisma.InstructorUpsertWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorUpsertWithoutCoursesInput>;
export const InstructorUpsertWithoutCoursesInputObjectZodSchema = makeSchema();
