import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const TargetUpdatecolorInputObjectSchema: z.ZodType<Prisma.TargetUpdatecolorInput> = makeSchema() as unknown as z.ZodType<Prisma.TargetUpdatecolorInput>;
export const TargetUpdatecolorInputObjectZodSchema = makeSchema();
