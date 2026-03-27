import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextCreateManyInputObjectSchema as TextCreateManyInputObjectSchema } from './objects/TextCreateManyInput.schema';

export const TextCreateManyAndReturnSchema: z.ZodType<Prisma.TextCreateManyAndReturnArgs> = z.object({ select: TextSelectObjectSchema.optional(), data: z.union([ TextCreateManyInputObjectSchema, z.array(TextCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TextCreateManyAndReturnArgs>;

export const TextCreateManyAndReturnZodSchema = z.object({ select: TextSelectObjectSchema.optional(), data: z.union([ TextCreateManyInputObjectSchema, z.array(TextCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();