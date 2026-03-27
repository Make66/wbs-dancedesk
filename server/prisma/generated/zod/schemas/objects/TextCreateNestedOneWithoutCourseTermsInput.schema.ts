import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCourseTermsInputObjectSchema as TextCreateWithoutCourseTermsInputObjectSchema } from './TextCreateWithoutCourseTermsInput.schema';
import { TextUncheckedCreateWithoutCourseTermsInputObjectSchema as TextUncheckedCreateWithoutCourseTermsInputObjectSchema } from './TextUncheckedCreateWithoutCourseTermsInput.schema';
import { TextCreateOrConnectWithoutCourseTermsInputObjectSchema as TextCreateOrConnectWithoutCourseTermsInputObjectSchema } from './TextCreateOrConnectWithoutCourseTermsInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseTermsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCourseTermsInputObjectSchema).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional()
}).strict();
export const TextCreateNestedOneWithoutCourseTermsInputObjectSchema: z.ZodType<Prisma.TextCreateNestedOneWithoutCourseTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateNestedOneWithoutCourseTermsInput>;
export const TextCreateNestedOneWithoutCourseTermsInputObjectZodSchema = makeSchema();
