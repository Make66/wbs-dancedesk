import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorCreateWithoutCoursesInputObjectSchema as InstructorCreateWithoutCoursesInputObjectSchema } from './InstructorCreateWithoutCoursesInput.schema';
import { InstructorUncheckedCreateWithoutCoursesInputObjectSchema as InstructorUncheckedCreateWithoutCoursesInputObjectSchema } from './InstructorUncheckedCreateWithoutCoursesInput.schema';
import { InstructorCreateOrConnectWithoutCoursesInputObjectSchema as InstructorCreateOrConnectWithoutCoursesInputObjectSchema } from './InstructorCreateOrConnectWithoutCoursesInput.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './InstructorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InstructorCreateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedCreateWithoutCoursesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InstructorCreateOrConnectWithoutCoursesInputObjectSchema).optional(),
  connect: z.lazy(() => InstructorWhereUniqueInputObjectSchema).optional()
}).strict();
export const InstructorCreateNestedOneWithoutCoursesInputObjectSchema: z.ZodType<Prisma.InstructorCreateNestedOneWithoutCoursesInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorCreateNestedOneWithoutCoursesInput>;
export const InstructorCreateNestedOneWithoutCoursesInputObjectZodSchema = makeSchema();
