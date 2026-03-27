import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseCreateWithoutTextInfoInputObjectSchema as CourseCreateWithoutTextInfoInputObjectSchema } from './CourseCreateWithoutTextInfoInput.schema';
import { CourseUncheckedCreateWithoutTextInfoInputObjectSchema as CourseUncheckedCreateWithoutTextInfoInputObjectSchema } from './CourseUncheckedCreateWithoutTextInfoInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseCreateWithoutTextInfoInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInfoInputObjectSchema)])
}).strict();
export const CourseCreateOrConnectWithoutTextInfoInputObjectSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutTextInfoInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateOrConnectWithoutTextInfoInput>;
export const CourseCreateOrConnectWithoutTextInfoInputObjectZodSchema = makeSchema();
