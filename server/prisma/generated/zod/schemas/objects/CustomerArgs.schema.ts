import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { CustomerSelectObjectSchema as CustomerSelectObjectSchema } from './CustomerSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CustomerSelectObjectSchema).optional()
}).strict();
export const CustomerArgsObjectSchema = makeSchema();
export const CustomerArgsObjectZodSchema = makeSchema();
