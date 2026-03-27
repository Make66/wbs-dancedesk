import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextInputObjectSchema as CourseCreateWithoutTextInputObjectSchema } from './CourseCreateWithoutTextInput.schema';
import { CourseUncheckedCreateWithoutTextInputObjectSchema as CourseUncheckedCreateWithoutTextInputObjectSchema } from './CourseUncheckedCreateWithoutTextInput.schema';
import { CourseCreateOrConnectWithoutTextInputObjectSchema as CourseCreateOrConnectWithoutTextInputObjectSchema } from './CourseCreateOrConnectWithoutTextInput.schema';
import { CourseUpsertWithWhereUniqueWithoutTextInputObjectSchema as CourseUpsertWithWhereUniqueWithoutTextInputObjectSchema } from './CourseUpsertWithWhereUniqueWithoutTextInput.schema';
import { CourseCreateManyTextInputEnvelopeObjectSchema as CourseCreateManyTextInputEnvelopeObjectSchema } from './CourseCreateManyTextInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithWhereUniqueWithoutTextInputObjectSchema as CourseUpdateWithWhereUniqueWithoutTextInputObjectSchema } from './CourseUpdateWithWhereUniqueWithoutTextInput.schema';
import { CourseUpdateManyWithWhereWithoutTextInputObjectSchema as CourseUpdateManyWithWhereWithoutTextInputObjectSchema } from './CourseUpdateManyWithWhereWithoutTextInput.schema';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextInputObjectSchema), z.lazy(() => CourseCreateWithoutTextInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextInputObjectSchema), z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextInputObjectSchema), z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseUpdateManyWithWhereWithoutTextInputObjectSchema), z.lazy(() => CourseUpdateManyWithWhereWithoutTextInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseUncheckedUpdateManyWithoutTextNestedInputObjectSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutTextNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutTextNestedInput>;
export const CourseUncheckedUpdateManyWithoutTextNestedInputObjectZodSchema = makeSchema();
