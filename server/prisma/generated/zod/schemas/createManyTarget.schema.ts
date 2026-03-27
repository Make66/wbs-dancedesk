import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetCreateManyInputObjectSchema as TargetCreateManyInputObjectSchema } from './objects/TargetCreateManyInput.schema';

export const TargetCreateManySchema: z.ZodType<Prisma.TargetCreateManyArgs> = z.object({ data: z.union([ TargetCreateManyInputObjectSchema, z.array(TargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TargetCreateManyArgs>;

export const TargetCreateManyZodSchema = z.object({ data: z.union([ TargetCreateManyInputObjectSchema, z.array(TargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();