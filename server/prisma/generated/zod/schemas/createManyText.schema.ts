import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextCreateManyInputObjectSchema as TextCreateManyInputObjectSchema } from './objects/TextCreateManyInput.schema';

export const TextCreateManySchema: z.ZodType<Prisma.TextCreateManyArgs> = z.object({ data: z.union([ TextCreateManyInputObjectSchema, z.array(TextCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TextCreateManyArgs>;

export const TextCreateManyZodSchema = z.object({ data: z.union([ TextCreateManyInputObjectSchema, z.array(TextCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();