import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  email: z.string().optional(),
  id: z.string().optional()
}).strict();
export const CustomerWhereUniqueInputObjectSchema: z.ZodType<Prisma.CustomerWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerWhereUniqueInput>;
export const CustomerWhereUniqueInputObjectZodSchema = makeSchema();
