import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { TargetArgsObjectSchema as TargetArgsObjectSchema } from './TargetArgs.schema'

const makeSchema = () => z.object({
  target: z.union([z.boolean(), z.lazy(() => TargetArgsObjectSchema)]).optional()
}).strict();
export const CategoryIncludeObjectSchema: z.ZodType<Prisma.CategoryInclude> = makeSchema() as unknown as z.ZodType<Prisma.CategoryInclude>;
export const CategoryIncludeObjectZodSchema = makeSchema();
