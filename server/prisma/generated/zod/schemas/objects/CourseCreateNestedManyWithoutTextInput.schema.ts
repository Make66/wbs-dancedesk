import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseCreateWithoutTextInputObjectSchema as CourseCreateWithoutTextInputObjectSchema } from './CourseCreateWithoutTextInput.schema';
import { CourseUncheckedCreateWithoutTextInputObjectSchema as CourseUncheckedCreateWithoutTextInputObjectSchema } from './CourseUncheckedCreateWithoutTextInput.schema';
import { CourseCreateOrConnectWithoutTextInputObjectSchema as CourseCreateOrConnectWithoutTextInputObjectSchema } from './CourseCreateOrConnectWithoutTextInput.schema';
import { CourseCreateManyTextInputEnvelopeObjectSchema as CourseCreateManyTextInputEnvelopeObjectSchema } from './CourseCreateManyTextInputEnvelope.schema';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CourseCreateWithoutTextInputObjectSchema), z.lazy(() => CourseCreateWithoutTextInputObjectSchema).array(), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CourseCreateOrConnectWithoutTextInputObjectSchema), z.lazy(() => CourseCreateOrConnectWithoutTextInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CourseCreateManyTextInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CourseWhereUniqueInputObjectSchema), z.lazy(() => CourseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CourseCreateNestedManyWithoutTextInputObjectSchema: z.ZodType<Prisma.CourseCreateNestedManyWithoutTextInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateNestedManyWithoutTextInput>;
export const CourseCreateNestedManyWithoutTextInputObjectZodSchema = makeSchema();
