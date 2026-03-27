import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { RegistrationSelectObjectSchema as RegistrationSelectObjectSchema } from './RegistrationSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => RegistrationSelectObjectSchema).optional()
}).strict();
export const RegistrationArgsObjectSchema = makeSchema();
export const RegistrationArgsObjectZodSchema = makeSchema();
