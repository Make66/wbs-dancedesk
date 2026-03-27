import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCoursesInputObjectSchema as TextCreateWithoutCoursesInputObjectSchema } from './TextCreateWithoutCoursesInput.schema';
import { TextUncheckedCreateWithoutCoursesInputObjectSchema as TextUncheckedCreateWithoutCoursesInputObjectSchema } from './TextUncheckedCreateWithoutCoursesInput.schema';
import { TextCreateOrConnectWithoutCoursesInputObjectSchema as TextCreateOrConnectWithoutCoursesInputObjectSchema } from './TextCreateOrConnectWithoutCoursesInput.schema';
import { TextUpsertWithoutCoursesInputObjectSchema as TextUpsertWithoutCoursesInputObjectSchema } from './TextUpsertWithoutCoursesInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextUpdateToOneWithWhereWithoutCoursesInputObjectSchema as TextUpdateToOneWithWhereWithoutCoursesInputObjectSchema } from './TextUpdateToOneWithWhereWithoutCoursesInput.schema';
import { TextUpdateWithoutCoursesInputObjectSchema as TextUpdateWithoutCoursesInputObjectSchema } from './TextUpdateWithoutCoursesInput.schema';
import { TextUncheckedUpdateWithoutCoursesInputObjectSchema as TextUncheckedUpdateWithoutCoursesInputObjectSchema } from './TextUncheckedUpdateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCoursesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCoursesInputObjectSchema).optional(),
  upsert: z.lazy(() => TextUpsertWithoutCoursesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TextUpdateToOneWithWhereWithoutCoursesInputObjectSchema), z.lazy(() => TextUpdateWithoutCoursesInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCoursesInputObjectSchema)]).optional()
}).strict();
export const TextUpdateOneWithoutCoursesNestedInputObjectSchema: z.ZodType<Prisma.TextUpdateOneWithoutCoursesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateOneWithoutCoursesNestedInput>;
export const TextUpdateOneWithoutCoursesNestedInputObjectZodSchema = makeSchema();
