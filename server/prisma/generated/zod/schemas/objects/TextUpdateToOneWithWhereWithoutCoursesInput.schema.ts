import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextUpdateWithoutCoursesInputObjectSchema as TextUpdateWithoutCoursesInputObjectSchema } from './TextUpdateWithoutCoursesInput.schema';
import { TextUncheckedUpdateWithoutCoursesInputObjectSchema as TextUncheckedUpdateWithoutCoursesInputObjectSchema } from './TextUncheckedUpdateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TextUpdateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCoursesInputObjectSchema)])
}).strict();
export const TextUpdateToOneWithWhereWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCoursesInput>;
export const TextUpdateToOneWithWhereWithoutCoursesInputObjectZodSchema = makeSchema();
