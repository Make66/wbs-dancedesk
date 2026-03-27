import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './InstructorWhereUniqueInput.schema';
import { InstructorCreateWithoutCoursesInputObjectSchema as InstructorCreateWithoutCoursesInputObjectSchema } from './InstructorCreateWithoutCoursesInput.schema';
import { InstructorUncheckedCreateWithoutCoursesInputObjectSchema as InstructorUncheckedCreateWithoutCoursesInputObjectSchema } from './InstructorUncheckedCreateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InstructorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InstructorCreateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedCreateWithoutCoursesInputObjectSchema)])
}).strict();
export const InstructorCreateOrConnectWithoutCoursesInputObjectSchema: z.ZodType<Prisma.InstructorCreateOrConnectWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorCreateOrConnectWithoutCoursesInput>;
export const InstructorCreateOrConnectWithoutCoursesInputObjectZodSchema = makeSchema();
