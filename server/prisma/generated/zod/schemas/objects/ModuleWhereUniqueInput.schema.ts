import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ModuleWhereUniqueInputObjectSchema: z.ZodType<Prisma.ModuleWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ModuleWhereUniqueInput>;
export const ModuleWhereUniqueInputObjectZodSchema = makeSchema();
