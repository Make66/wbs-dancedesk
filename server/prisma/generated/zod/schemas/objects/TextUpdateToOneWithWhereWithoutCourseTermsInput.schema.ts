import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextUpdateWithoutCourseTermsInputObjectSchema as TextUpdateWithoutCourseTermsInputObjectSchema } from './TextUpdateWithoutCourseTermsInput.schema';
import { TextUncheckedUpdateWithoutCourseTermsInputObjectSchema as TextUncheckedUpdateWithoutCourseTermsInputObjectSchema } from './TextUncheckedUpdateWithoutCourseTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TextUpdateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseTermsInputObjectSchema)])
}).strict();
export const TextUpdateToOneWithWhereWithoutCourseTermsInputObjectSchema: z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCourseTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateToOneWithWhereWithoutCourseTermsInput>;
export const TextUpdateToOneWithWhereWithoutCourseTermsInputObjectZodSchema = makeSchema();
