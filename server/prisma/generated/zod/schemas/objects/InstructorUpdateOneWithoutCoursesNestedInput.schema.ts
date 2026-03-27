import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorCreateWithoutCoursesInputObjectSchema as InstructorCreateWithoutCoursesInputObjectSchema } from './InstructorCreateWithoutCoursesInput.schema';
import { InstructorUncheckedCreateWithoutCoursesInputObjectSchema as InstructorUncheckedCreateWithoutCoursesInputObjectSchema } from './InstructorUncheckedCreateWithoutCoursesInput.schema';
import { InstructorCreateOrConnectWithoutCoursesInputObjectSchema as InstructorCreateOrConnectWithoutCoursesInputObjectSchema } from './InstructorCreateOrConnectWithoutCoursesInput.schema';
import { InstructorUpsertWithoutCoursesInputObjectSchema as InstructorUpsertWithoutCoursesInputObjectSchema } from './InstructorUpsertWithoutCoursesInput.schema';
import { InstructorWhereInputObjectSchema as InstructorWhereInputObjectSchema } from './InstructorWhereInput.schema';
import { InstructorWhereUniqueInputObjectSchema as InstructorWhereUniqueInputObjectSchema } from './InstructorWhereUniqueInput.schema';
import { InstructorUpdateToOneWithWhereWithoutCoursesInputObjectSchema as InstructorUpdateToOneWithWhereWithoutCoursesInputObjectSchema } from './InstructorUpdateToOneWithWhereWithoutCoursesInput.schema';
import { InstructorUpdateWithoutCoursesInputObjectSchema as InstructorUpdateWithoutCoursesInputObjectSchema } from './InstructorUpdateWithoutCoursesInput.schema';
import { InstructorUncheckedUpdateWithoutCoursesInputObjectSchema as InstructorUncheckedUpdateWithoutCoursesInputObjectSchema } from './InstructorUncheckedUpdateWithoutCoursesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InstructorCreateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedCreateWithoutCoursesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InstructorCreateOrConnectWithoutCoursesInputObjectSchema).optional(),
  upsert: z.lazy(() => InstructorUpsertWithoutCoursesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => InstructorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => InstructorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => InstructorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => InstructorUpdateToOneWithWhereWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUpdateWithoutCoursesInputObjectSchema), z.lazy(() => InstructorUncheckedUpdateWithoutCoursesInputObjectSchema)]).optional()
}).strict();
export const InstructorUpdateOneWithoutCoursesNestedInputObjectSchema: z.ZodType<Prisma.InstructorUpdateOneWithoutCoursesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InstructorUpdateOneWithoutCoursesNestedInput>;
export const InstructorUpdateOneWithoutCoursesNestedInputObjectZodSchema = makeSchema();
