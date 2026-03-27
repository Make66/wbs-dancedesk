import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseCreateWithoutTextTermsInputObjectSchema as CourseCreateWithoutTextTermsInputObjectSchema } from './CourseCreateWithoutTextTermsInput.schema';
import { CourseUncheckedCreateWithoutTextTermsInputObjectSchema as CourseUncheckedCreateWithoutTextTermsInputObjectSchema } from './CourseUncheckedCreateWithoutTextTermsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseCreateWithoutTextTermsInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextTermsInputObjectSchema)])
}).strict();
export const CourseCreateOrConnectWithoutTextTermsInputObjectSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutTextTermsInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateOrConnectWithoutTextTermsInput>;
export const CourseCreateOrConnectWithoutTextTermsInputObjectZodSchema = makeSchema();
