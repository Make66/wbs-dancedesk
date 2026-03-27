import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextCreateWithoutCoursesInputObjectSchema as TextCreateWithoutCoursesInputObjectSchema } from './TextCreateWithoutCoursesInput.schema';
import { TextUncheckedCreateWithoutCoursesInputObjectSchema as TextUncheckedCreateWithoutCoursesInputObjectSchema } from './TextUncheckedCreateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TextWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TextCreateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCoursesInputObjectSchema)])
}).strict();
export const TextCreateOrConnectWithoutCoursesInputObjectSchema: z.ZodType<Prisma.TextCreateOrConnectWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.TextCreateOrConnectWithoutCoursesInput>;
export const TextCreateOrConnectWithoutCoursesInputObjectZodSchema = makeSchema();
