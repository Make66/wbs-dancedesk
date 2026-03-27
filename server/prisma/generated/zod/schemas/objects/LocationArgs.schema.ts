import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './LocationSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => LocationSelectObjectSchema).optional()
}).strict();
export const LocationArgsObjectSchema = makeSchema();
export const LocationArgsObjectZodSchema = makeSchema();
