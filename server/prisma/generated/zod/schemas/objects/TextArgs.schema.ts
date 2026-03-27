import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './TextSelect.schema';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './TextInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TextSelectObjectSchema).optional(),
  include: z.lazy(() => TextIncludeObjectSchema).optional()
}).strict();
export const TextArgsObjectSchema = makeSchema();
export const TextArgsObjectZodSchema = makeSchema();
