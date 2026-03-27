import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CategoryArgsObjectSchema as CategoryArgsObjectSchema } from './CategoryArgs.schema';
import { RoomArgsObjectSchema as RoomArgsObjectSchema } from './RoomArgs.schema';
import { InstructorArgsObjectSchema as InstructorArgsObjectSchema } from './InstructorArgs.schema';
import { TextArgsObjectSchema as TextArgsObjectSchema } from './TextArgs.schema'

const makeSchema = () => z.object({
  category: z.union([z.boolean(), z.lazy(() => CategoryArgsObjectSchema)]).optional(),
  room: z.union([z.boolean(), z.lazy(() => RoomArgsObjectSchema)]).optional(),
  instructor: z.union([z.boolean(), z.lazy(() => InstructorArgsObjectSchema)]).optional(),
  textTerms: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional(),
  textInfo: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional(),
  text: z.union([z.boolean(), z.lazy(() => TextArgsObjectSchema)]).optional()
}).strict();
export const CourseIncludeObjectSchema: z.ZodType<Prisma.CourseInclude> = makeSchema() as unknown as z.ZodType<Prisma.CourseInclude>;
export const CourseIncludeObjectZodSchema = makeSchema();
