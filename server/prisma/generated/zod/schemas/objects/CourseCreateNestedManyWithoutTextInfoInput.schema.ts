import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextInfoInputObjectSchema as CourseCreateWithoutTextInfoInputObjectSchema } from './CourseCreateWithoutTextInfoInput.schema';
import { CourseUncheckedCreateWithoutTextInfoInputObjectSchema as CourseUncheckedCreateWithoutTextInfoInputObjectSchema } from './CourseUncheckedCreateWithoutTextInfoInput.schema';
import { CourseCreateOrConnectWithoutTextInfoInputObjectSchema as CourseCreateOrConnectWithoutTextInfoInputObjectSchema } from './CourseCreateOrConnectWithoutTextInfoInput.schema';
import { CourseCreateManyTextInfoInputEnvelopeObjectSchema as CourseCreateManyTextInfoInputEnvelopeObjectSchema } from './CourseCreateManyTextInfoInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextInfoInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextInfoInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextInfoInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseCreateNestedManyWithoutTextInfoInputObjectSchema: z.ZodType<Prisma.CourseCreateNestedManyWithoutTextInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateNestedManyWithoutTextInfoInput>;
export const CourseCreateNestedManyWithoutTextInfoInputObjectZodSchema = makeSchema();
