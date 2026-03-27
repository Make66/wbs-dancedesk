import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const TargetCreatecolorInputObjectSchema: z.ZodType<Prisma.TargetCreatecolorInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetCreatecolorInput>;
export const TargetCreatecolorInputObjectZodSchema = makeSchema();
