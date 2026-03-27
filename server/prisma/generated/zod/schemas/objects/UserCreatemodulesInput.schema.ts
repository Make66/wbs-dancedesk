import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const UserCreatemodulesInputObjectSchema: z.ZodType<Prisma.UserCreatemodulesInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreatemodulesInput>;
export const UserCreatemodulesInputObjectZodSchema = makeSchema();
