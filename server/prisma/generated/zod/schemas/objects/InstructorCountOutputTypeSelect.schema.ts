import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorCountOutputTypeCountCoursesArgsObjectSchema as InstructorCountOutputTypeCountCoursesArgsObjectSchema } from './InstructorCountOutputTypeCountCoursesArgs.schema'

const makeSchema = () => z.object({
  courses: z.union([z.boolean(), z.lazy(() => InstructorCountOutputTypeCountCoursesArgsObjectSchema)]).optional()
}).strict();
export const InstructorCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.InstructorCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.InstructorCountOutputTypeSelect>;
export const InstructorCountOutputTypeSelectObjectZodSchema = makeSchema();
