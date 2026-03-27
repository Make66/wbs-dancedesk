import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TextCountOutputTypeSelectObjectSchema as TextCountOutputTypeSelectObjectSchema } from './TextCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TextCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TextCountOutputTypeArgsObjectSchema = makeSchema();
export const TextCountOutputTypeArgsObjectZodSchema = makeSchema();
