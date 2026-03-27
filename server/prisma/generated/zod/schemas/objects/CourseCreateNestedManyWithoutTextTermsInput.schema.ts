import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextTermsInputObjectSchema as CourseCreateWithoutTextTermsInputObjectSchema } from './CourseCreateWithoutTextTermsInput.schema';
import { CourseUncheckedCreateWithoutTextTermsInputObjectSchema as CourseUncheckedCreateWithoutTextTermsInputObjectSchema } from './CourseUncheckedCreateWithoutTextTermsInput.schema';
import { CourseCreateOrConnectWithoutTextTermsInputObjectSchema as CourseCreateOrConnectWithoutTextTermsInputObjectSchema } from './CourseCreateOrConnectWithoutTextTermsInput.schema';
import { CourseCreateManyTextTermsInputEnvelopeObjectSchema as CourseCreateManyTextTermsInputEnvelopeObjectSchema } from './CourseCreateManyTextTermsInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextTermsInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextTermsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextTermsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseCreateNestedManyWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseCreateNestedManyWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateNestedManyWithoutTextTermsInput>;
export const CourseCreateNestedManyWithoutTextTermsInputObjectZodSchema = makeSchema();
