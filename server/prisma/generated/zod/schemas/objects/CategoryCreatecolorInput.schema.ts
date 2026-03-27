import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const CategoryCreatecolorInputObjectSchema: z.ZodType<Prisma.CategoryCreatecolorInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryCreatecolorInput>;
export const CategoryCreatecolorInputObjectZodSchema = makeSchema();
