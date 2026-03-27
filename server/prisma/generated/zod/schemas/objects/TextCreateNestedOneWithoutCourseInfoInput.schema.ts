import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCourseInfoInputObjectSchema as TextCreateWithoutCourseInfoInputObjectSchema } from './TextCreateWithoutCourseInfoInput.schema';
import { TextUncheckedCreateWithoutCourseInfoInputObjectSchema as TextUncheckedCreateWithoutCourseInfoInputObjectSchema } from './TextUncheckedCreateWithoutCourseInfoInput.schema';
import { TextCreateOrConnectWithoutCourseInfoInputObjectSchema as TextCreateOrConnectWithoutCourseInfoInputObjectSchema } from './TextCreateOrConnectWithoutCourseInfoInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseInfoInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCourseInfoInputObjectSchema).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional()
}).strict();
export const TextCreateNestedOneWithoutCourseInfoInputObjectSchema: z.ZodType<Prisma.TextCreateNestedOneWithoutCourseInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateNestedOneWithoutCourseInfoInput>;
export const TextCreateNestedOneWithoutCourseInfoInputObjectZodSchema = makeSchema();
