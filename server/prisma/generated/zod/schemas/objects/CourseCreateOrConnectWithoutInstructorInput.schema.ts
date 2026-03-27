import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CourseWhereUniqueInputObjectSchema as CourseWhereUniqueInputObjectSchema } from './CourseWhereUniqueInput.schema';
import { CourseCreateWithoutInstructorInputObjectSchema as CourseCreateWithoutInstructorInputObjectSchema } from './CourseCreateWithoutInstructorInput.schema';
import { CourseUncheckedCreateWithoutInstructorInputObjectSchema as CourseUncheckedCreateWithoutInstructorInputObjectSchema } from './CourseUncheckedCreateWithoutInstructorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CourseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseCreateWithoutInstructorInputObjectSchema), z.lazy(() => CourseUncheckedCreateWithoutInstructorInputObjectSchema)])
}).strict();
export const CourseCreateOrConnectWithoutInstructorInputObjectSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutInstructorInput> = makeSchema() as unknown as z.ZodType<Prisma.CourseCreateOrConnectWithoutInstructorInput>;
export const CourseCreateOrConnectWithoutInstructorInputObjectZodSchema = makeSchema();
