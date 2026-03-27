import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCourseInfoInputObjectSchema as TextCreateWithoutCourseInfoInputObjectSchema } from './TextCreateWithoutCourseInfoInput.schema';
import { TextUncheckedCreateWithoutCourseInfoInputObjectSchema as TextUncheckedCreateWithoutCourseInfoInputObjectSchema } from './TextUncheckedCreateWithoutCourseInfoInput.schema';
import { TextCreateOrConnectWithoutCourseInfoInputObjectSchema as TextCreateOrConnectWithoutCourseInfoInputObjectSchema } from './TextCreateOrConnectWithoutCourseInfoInput.schema';
import { TextUpsertWithoutCourseInfoInputObjectSchema as TextUpsertWithoutCourseInfoInputObjectSchema } from './TextUpsertWithoutCourseInfoInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextUpdateToOneWithWhereWithoutCourseInfoInputObjectSchema as TextUpdateToOneWithWhereWithoutCourseInfoInputObjectSchema } from './TextUpdateToOneWithWhereWithoutCourseInfoInput.schema';
import { TextUpdateWithoutCourseInfoInputObjectSchema as TextUpdateWithoutCourseInfoInputObjectSchema } from './TextUpdateWithoutCourseInfoInput.schema';
import { TextUncheckedUpdateWithoutCourseInfoInputObjectSchema as TextUncheckedUpdateWithoutCourseInfoInputObjectSchema } from './TextUncheckedUpdateWithoutCourseInfoInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseInfoInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCourseInfoInputObjectSchema).optional(),
  upsert: z.lazy(() => TextUpsertWithoutCourseInfoInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TextUpdateToOneWithWhereWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUpdateWithoutCourseInfoInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseInfoInputObjectSchema)]).optional()
}).strict();
export const TextUpdateOneWithoutCourseInfoNestedInputObjectSchema: z.ZodType<Prisma.TextUpdateOneWithoutCourseInfoNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateOneWithoutCourseInfoNestedInput>;
export const TextUpdateOneWithoutCourseInfoNestedInputObjectZodSchema = makeSchema();
