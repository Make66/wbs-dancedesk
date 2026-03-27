import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextTermsInputObjectSchema as CourseCreateWithoutTextTermsInputObjectSchema } from './CourseCreateWithoutTextTermsInput.schema';
import { CourseUncheckedCreateWithoutTextTermsInputObjectSchema as CourseUncheckedCreateWithoutTextTermsInputObjectSchema } from './CourseUncheckedCreateWithoutTextTermsInput.schema';
import { CourseCreateOrConnectWithoutTextTermsInputObjectSchema as CourseCreateOrConnectWithoutTextTermsInputObjectSchema } from './CourseCreateOrConnectWithoutTextTermsInput.schema';
import { CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectSchema as CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectSchema } from './CourseUpsertWithWhereUniqueWithoutTextTermsInput.schema';
import { CourseCreateManyTextTermsInputEnvelopeObjectSchema as CourseCreateManyTextTermsInputEnvelopeObjectSchema } from './CourseCreateManyTextTermsInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectSchema as CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectSchema } from './CourseUpdateWithWhereUniqueWithoutTextTermsInput.schema';
import { CourseUpdateManyWithWhereWithoutTextTermsInputObjectSchema as CourseUpdateManyWithWhereWithoutTextTermsInputObjectSchema } from './CourseUpdateManyWithWhereWithoutTextTermsInput.schema';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextTermsInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextTermsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUpsertWithWhereUniqueWithoutTextTermsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextTermsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUpdateWithWhereUniqueWithoutTextTermsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseUpdateManyWithWhereWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUpdateManyWithWhereWithoutTextTermsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseUpdateManyWithoutTextTermsNestedInputObjectSchema: z.ZodType<Prisma.CourseUpdateManyWithoutTextTermsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUpdateManyWithoutTextTermsNestedInput>;
export const CourseUpdateManyWithoutTextTermsNestedInputObjectZodSchema = makeSchema();
