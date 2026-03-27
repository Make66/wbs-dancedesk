import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseCreateWithoutTextInputObjectSchema as CourseCreateWithoutTextInputObjectSchema } from './CourseCreateWithoutTextInput.schema';
import { CourseUncheckedCreateWithoutTextInputObjectSchema as CourseUncheckedCreateWithoutTextInputObjectSchema } from './CourseUncheckedCreateWithoutTextInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseCreateWithoutTextInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutTextInputObjectSchema)])
}).strict();
export const CourseCreateOrConnectWithoutTextInputObjectSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutTextInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateOrConnectWithoutTextInput>;
export const CourseCreateOrConnectWithoutTextInputObjectZodSchema = makeSchema();
