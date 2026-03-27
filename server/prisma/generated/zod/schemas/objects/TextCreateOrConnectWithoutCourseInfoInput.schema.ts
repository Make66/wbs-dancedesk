import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextCreateWithoutCourseInfoInputObjectSchema as TextCreateWithoutCourseInfoInputObjectSchema } from './TextCreateWithoutCourseInfoInput.schema';
import { TextUncheckedCreateWithoutCourseInfoInputObjectSchema as TextUncheckedCreateWithoutCourseInfoInputObjectSchema } from './TextUncheckedCreateWithoutCourseInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TextCreateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseInfoInputObjectSchema)])
}).strict();
export const TextCreateOrConnectWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextCreateOrConnectWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateOrConnectWithoutCourseInfoInput>;
export const TextCreateOrConnectWithoutCourseInfoInputObjectZodSchema = makeSchema();
