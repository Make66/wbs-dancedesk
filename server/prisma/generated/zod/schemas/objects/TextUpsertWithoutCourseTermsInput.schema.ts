import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextUpdateWithoutCourseTermsInputObjectSchema as TextUpdateWithoutCourseTermsInputObjectSchema } from './TextUpdateWithoutCourseTermsInput.schema';
import { TextUncheckedUpdateWithoutCourseTermsInputObjectSchema as TextUncheckedUpdateWithoutCourseTermsInputObjectSchema } from './TextUncheckedUpdateWithoutCourseTermsInput.schema';
import { TextCreateWithoutCourseTermsInputObjectSchema as TextCreateWithoutCourseTermsInputObjectSchema } from './TextCreateWithoutCourseTermsInput.schema';
import { TextUncheckedCreateWithoutCourseTermsInputObjectSchema as TextUncheckedCreateWithoutCourseTermsInputObjectSchema } from './TextUncheckedCreateWithoutCourseTermsInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TextUpdateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseTermsInputObjectSchema)]),
  create: z.union([z.lazy(() => TextCreateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseTermsInputObjectSchema)]),
  where: z.lazy(() => TextWhereInputObjectSchema).optional()
}).strict();
export const TextUpsertWithoutCourseTermsInputObjectSchema: z.ZodType<Prisma.TextUpsertWithoutCourseTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpsertWithoutCourseTermsInput>;
export const TextUpsertWithoutCourseTermsInputObjectZodSchema = makeSchema();
