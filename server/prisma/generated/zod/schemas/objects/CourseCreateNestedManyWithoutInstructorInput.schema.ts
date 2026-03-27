import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutInstructorInputObjectSchema as CourseCreateWithoutInstructorInputObjectSchema } from './CourseCreateWithoutInstructorInput.schema';
import { CourseUncheckedCreateWithoutInstructorInputObjectSchema as CourseUncheckedCreateWithoutInstructorInputObjectSchema } from './CourseUncheckedCreateWithoutInstructorInput.schema';
import { CourseCreateOrConnectWithoutInstructorInputObjectSchema as CourseCreateOrConnectWithoutInstructorInputObjectSchema } from './CourseCreateOrConnectWithoutInstructorInput.schema';
import { CourseCreateManyInstructorInputEnvelopeObjectSchema as CourseCreateManyInstructorInputEnvelopeObjectSchema } from './CourseCreateManyInstructorInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutInstructorInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutInstructorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyInstructorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseCreateNestedManyWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseCreateNestedManyWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateNestedManyWithoutInstructorInput>;
export const CourseCreateNestedManyWithoutInstructorInputObjectZodSchema = makeSchema();
