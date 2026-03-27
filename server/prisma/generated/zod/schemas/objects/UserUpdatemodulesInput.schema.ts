import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const UserUpdatemodulesInputObjectSchema: z.ZodType<Prisma.UserUpdatemodulesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserUpdatemodulesInput>;
export const UserUpdatemodulesInputObjectZodSchema = makeSchema();
