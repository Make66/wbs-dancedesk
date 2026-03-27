import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextUpdateWithoutCoursesInputObjectSchema as TextUpdateWithoutCoursesInputObjectSchema } from './TextUpdateWithoutCoursesInput.schema';
import { TextUncheckedUpdateWithoutCoursesInputObjectSchema as TextUncheckedUpdateWithoutCoursesInputObjectSchema } from './TextUncheckedUpdateWithoutCoursesInput.schema';
import { TextCreateWithoutCoursesInputObjectSchema as TextCreateWithoutCoursesInputObjectSchema } from './TextCreateWithoutCoursesInput.schema';
import { TextUncheckedCreateWithoutCoursesInputObjectSchema as TextUncheckedCreateWithoutCoursesInputObjectSchema } from './TextUncheckedCreateWithoutCoursesInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TextUpdateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCoursesInputObjectSchema)]),
  create: z.union([z.lazy(() => TextCreateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCoursesInputObjectSchema)]),
  where: z.lazy(() => TextWhereInputObjectSchema).optional()
}).strict();
export const TextUpsertWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextUpsertWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpsertWithoutCoursesInput>;
export const TextUpsertWithoutCoursesInputObjectZodSchema = makeSchema();
