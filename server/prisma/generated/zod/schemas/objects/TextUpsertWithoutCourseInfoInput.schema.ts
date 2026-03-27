import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextUpdateWithoutCourseInfoInputObjectSchema as TextUpdateWithoutCourseInfoInputObjectSchema } from './TextUpdateWithoutCourseInfoInput.schema';
import { TextUncheckedUpdateWithoutCourseInfoInputObjectSchema as TextUncheckedUpdateWithoutCourseInfoInputObjectSchema } from './TextUncheckedUpdateWithoutCourseInfoInput.schema';
import { TextCreateWithoutCourseInfoInputObjectSchema as TextCreateWithoutCourseInfoInputObjectSchema } from './TextCreateWithoutCourseInfoInput.schema';
import { TextUncheckedCreateWithoutCourseInfoInputObjectSchema as TextUncheckedCreateWithoutCourseInfoInputObjectSchema } from './TextUncheckedCreateWithoutCourseInfoInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TextUpdateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseInfoInputObjectSchema)]),
  create: z.union([z.lazy(() => TextCreateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseInfoInputObjectSchema)]),
  where: z.lazy(() => TextWhereInputObjectSchema).optional()
}).strict();
export const TextUpsertWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextUpsertWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpsertWithoutCourseInfoInput>;
export const TextUpsertWithoutCourseInfoInputObjectZodSchema = makeSchema();
