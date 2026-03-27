import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextCreateWithoutCourseTermsInputObjectSchema as TextCreateWithoutCourseTermsInputObjectSchema } from './TextCreateWithoutCourseTermsInput.schema';
import { TextUncheckedCreateWithoutCourseTermsInputObjectSchema as TextUncheckedCreateWithoutCourseTermsInputObjectSchema } from './TextUncheckedCreateWithoutCourseTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TextCreateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseTermsInputObjectSchema)])
}).strict();
export const TextCreateOrConnectWithoutCourseTermsInputObjectSchema: z.ZodType<Prisma.TextCreateOrConnectWithoutCourseTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateOrConnectWithoutCourseTermsInput>;
export const TextCreateOrConnectWithoutCourseTermsInputObjectZodSchema = makeSchema();
