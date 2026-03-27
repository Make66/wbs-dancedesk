import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetCreateManyInputObjectSchema as TargetCreateManyInputObjectSchema } from './objects/TargetCreateManyInput.schema';

export const TargetCreateManyAndReturnSchema: z.ZodType<Prisma.TargetCreateManyAndReturnArgs> = z.object({ select: TargetSelectObjectSchema.optional(), data: z.union([ TargetCreateManyInputObjectSchema, z.array(TargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TargetCreateManyAndReturnArgs>;

export const TargetCreateManyAndReturnZodSchema = z.object({ select: TargetSelectObjectSchema.optional(), data: z.union([ TargetCreateManyInputObjectSchema, z.array(TargetCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();