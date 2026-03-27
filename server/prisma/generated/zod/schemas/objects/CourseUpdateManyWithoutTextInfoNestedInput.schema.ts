import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextInfoInputObjectSchema as CourseCreateWithoutTextInfoInputObjectSchema } from './CourseCreateWithoutTextInfoInput.schema';
import { CourseUncheckedCreateWithoutTextInfoInputObjectSchema as CourseUncheckedCreateWithoutTextInfoInputObjectSchema } from './CourseUncheckedCreateWithoutTextInfoInput.schema';
import { CourseCreateOrConnectWithoutTextInfoInputObjectSchema as CourseCreateOrConnectWithoutTextInfoInputObjectSchema } from './CourseCreateOrConnectWithoutTextInfoInput.schema';
import { CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectSchema as CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectSchema } from './CourseUpsertWithWhereUniqueWithoutTextInfoInput.schema';
import { CourseCreateManyTextInfoInputEnvelopeObjectSchema as CourseCreateManyTextInfoInputEnvelopeObjectSchema } from './CourseCreateManyTextInfoInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectSchema as CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectSchema } from './CourseUpdateWithWhereUniqueWithoutTextInfoInput.schema';
import { CourseUpdateManyWithWhereWithoutTextInfoInputObjectSchema as CourseUpdateManyWithWhereWithoutTextInfoInputObjectSchema } from './CourseUpdateManyWithWhereWithoutTextInfoInput.schema';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextInfoInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextInfoInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextInfoInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextInfoInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextInfoInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseUpdateManyWithWhereWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUpdateManyWithWhereWithoutTextInfoInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseUpdateManyWithoutTextInfoNestedInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithoutTextInfoNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithoutTextInfoNestedInput>;
export const CourseUpdateManyWithoutTextInfoNestedInputObjectZodSchema = makeSchema();
