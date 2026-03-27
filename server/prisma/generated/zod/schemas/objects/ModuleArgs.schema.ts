import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { ModuleSelectObjectSchema as ModuleSelectObjectSchema } from './ModuleSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ModuleSelectObjectSchema).optional()
}).strict();
export const ModuleArgsObjectSchema = makeSchema();
export const ModuleArgsObjectZodSchema = makeSchema();
