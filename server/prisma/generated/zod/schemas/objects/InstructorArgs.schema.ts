import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorSelectObjectSchema as InstructorSelectObjectSchema } from './InstructorSelect.schema';
import { InstructorIncludeObjectSchema as InstructorIncludeObjectSchema } from './InstructorInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => InstructorSelectObjectSchema).optional(),
  include: z.lazy(() => InstructorIncludeObjectSchema).optional()
}).strict();
export const InstructorArgsObjectSchema = makeSchema();
export const InstructorArgsObjectZodSchema = makeSchema();
