import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './TargetSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TargetSelectObjectSchema).optional()
}).strict();
export const TargetArgsObjectSchema = makeSchema();
export const TargetArgsObjectZodSchema = makeSchema();
