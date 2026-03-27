import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCoursesInputObjectSchema as TextCreateWithoutCoursesInputObjectSchema } from './TextCreateWithoutCoursesInput.schema';
import { TextUncheckedCreateWithoutCoursesInputObjectSchema as TextUncheckedCreateWithoutCoursesInputObjectSchema } from './TextUncheckedCreateWithoutCoursesInput.schema';
import { TextCreateOrConnectWithoutCoursesInputObjectSchema as TextCreateOrConnectWithoutCoursesInputObjectSchema } from './TextCreateOrConnectWithoutCoursesInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCoursesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCoursesInputObjectSchema).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional()
}).strict();
export const TextCreateNestedOneWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextCreateNestedOneWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateNestedOneWithoutCoursesInput>;
export const TextCreateNestedOneWithoutCoursesInputObjectZodSchema = makeSchema();
