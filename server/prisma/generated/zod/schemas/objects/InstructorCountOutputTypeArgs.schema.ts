import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { InstructorCountOutputTypeSelectObjectSchema as InstructorCountOutputTypeSelectObjectSchema } from './InstructorCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => InstructorCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const InstructorCountOutputTypeArgsObjectSchema = makeSchema();
export const InstructorCountOutputTypeArgsObjectZodSchema = makeSchema();
