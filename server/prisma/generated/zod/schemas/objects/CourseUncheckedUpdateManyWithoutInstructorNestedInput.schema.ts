import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutInstructorInputObjectSchema as CourseCreateWithoutInstructorInputObjectSchema } from './CourseCreateWithoutInstructorInput.schema';
import { CourseUncheckedCreateWithoutInstructorInputObjectSchema as CourseUncheckedCreateWithoutInstructorInputObjectSchema } from './CourseUncheckedCreateWithoutInstructorInput.schema';
import { CourseCreateOrConnectWithoutInstructorInputObjectSchema as CourseCreateOrConnectWithoutInstructorInputObjectSchema } from './CourseCreateOrConnectWithoutInstructorInput.schema';
import { CourseUpsertWithWhereUniqueWithoutInstructorInputObjectSchema as CourseUpsertWithWhereUniqueWithoutInstructorInputObjectSchema } from './CourseUpsertWithWhereUniqueWithoutInstructorInput.schema';
import { CourseCreateManyInstructorInputEnvelopeObjectSchema as CourseCreateManyInstructorInputEnvelopeObjectSchema } from './CourseCreateManyInstructorInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseUpdateWithWhereUniqueWithoutInstructorInputObjectSchema as CourseUpdateWithWhereUniqueWithoutInstructorInputObjectSchema } from './CourseUpdateWithWhereUniqueWithoutInstructorInput.schema';
import { CourseUpdateManyWithWhereWithoutInstructorInputObjectSchema as CourseUpdateManyWithWhereWithoutInstructorInputObjectSchema } from './CourseUpdateManyWithWhereWithoutInstructorInput.schema';
import { CourseScalarWhereInputObjectSchema as CourseScalarWhereInputObjectSchema } from './CourseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutInstructorInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutInstructorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CourseUpsertWithWhereUniqueWithoutInstructorInputObjectSchema), z.lazy(() => CourseUpsertWithWhereUniqueWithoutInstructorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyInstructorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CourseUpdateWithWhereUniqueWithoutInstructorInputObjectSchema), z.lazy(() => CourseUpdateWithWhereUniqueWithoutInstructorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CourseUpdateManyWithWhereWithoutInstructorInputObjectSchema), z.lazy(() => CourseUpdateManyWithWhereWithoutInstructorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CourseScalarWhereInputObjectSchema), z.lazy(() => CourseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CourseUncheckedUpdateManyWithoutInstructorNestedInputObjectSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutInstructorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseUncheckedUpdateManyWithoutInstructorNestedInput>;
export const CourseUncheckedUpdateManyWithoutInstructorNestedInputObjectZodSchema = makeSchema();
