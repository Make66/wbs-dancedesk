import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCreateWithoutCourseTermsInputObjectSchema as TextCreateWithoutCourseTermsInputObjectSchema } from './TextCreateWithoutCourseTermsInput.schema';
import { TextUncheckedCreateWithoutCourseTermsInputObjectSchema as TextUncheckedCreateWithoutCourseTermsInputObjectSchema } from './TextUncheckedCreateWithoutCourseTermsInput.schema';
import { TextCreateOrConnectWithoutCourseTermsInputObjectSchema as TextCreateOrConnectWithoutCourseTermsInputObjectSchema } from './TextCreateOrConnectWithoutCourseTermsInput.schema';
import { TextUpsertWithoutCourseTermsInputObjectSchema as TextUpsertWithoutCourseTermsInputObjectSchema } from './TextUpsertWithoutCourseTermsInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './TextWhereInput.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './TextWhereUniqueInput.schema';
import { TextUpdateToOneWithWhereWithoutCourseTermsInputObjectSchema as TextUpdateToOneWithWhereWithoutCourseTermsInputObjectSchema } from './TextUpdateToOneWithWhereWithoutCourseTermsInput.schema';
import { TextUpdateWithoutCourseTermsInputObjectSchema as TextUpdateWithoutCourseTermsInputObjectSchema } from './TextUpdateWithoutCourseTermsInput.schema';
import { TextUncheckedUpdateWithoutCourseTermsInputObjectSchema as TextUncheckedUpdateWithoutCourseTermsInputObjectSchema } from './TextUncheckedUpdateWithoutCourseTermsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TextCreateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedCreateWithoutCourseTermsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TextCreateOrConnectWithoutCourseTermsInputObjectSchema).optional(),
  upsert: z.lazy(() => TextUpsertWithoutCourseTermsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TextWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TextWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TextUpdateToOneWithWhereWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUpdateWithoutCourseTermsInputObjectSchema), z.lazy(() => TextUncheckedUpdateWithoutCourseTermsInputObjectSchema)]).optional()
}).strict();
export const TextUpdateOneWithoutCourseTermsNestedInputObjectSchema: z.ZodType<Prisma.TextUpdateOneWithoutCourseTermsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TextUpdateOneWithoutCourseTermsNestedInput>;
export const TextUpdateOneWithoutCourseTermsNestedInputObjectZodSchema = makeSchema();
