import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TextWhereUniqueInputObjectSchema: z.ZodType<Prisma.TextWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TextWhereUniqueInput>;
export const TextWhereUniqueInputObjectZodSchema = makeSchema();
