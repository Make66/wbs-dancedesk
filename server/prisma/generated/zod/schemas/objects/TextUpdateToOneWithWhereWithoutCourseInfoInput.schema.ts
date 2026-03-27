import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextUpdateWithoutCourseInfoInputObjectSchema as TextUpdateWithoutCourseInfoInputObjectSchema } from './TextUpdateWithoutCourseInfoInput.schema';
import { TextUncheckedUpdateWithoutCourseInfoInputObjectSchema as TextUncheckedUpdateWithoutCourseInfoInputObjectSchema } from './TextUncheckedUpdateWithoutCourseInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TextUpdateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseInfoInputObjectSchema)])
}).strict();
export const TextUpdateToOneWithWhereWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCourseInfoInput>;
export const TextUpdateToOneWithWhereWithoutCourseInfoInputObjectZodSchema = makeSchema();
