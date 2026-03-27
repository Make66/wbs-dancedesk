import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextUpdateManyMutationInputObjectSchema as TextUpdateManyMutationInputObjectSchema } from './objects/TextUpdateManyMutationInput.schema';
import { TextWhereInputObjectSchema as TextWhereInputObjectSchema } from './objects/TextWhereInput.schema';

export const TextUpdateManyAndReturnSchema: z.ZodType<Prisma.TextUpdateManyAndReturnArgs> = z.object({ select: TextSelectObjectSchema.optional(), data: TextUpdateManyMutationInputObjectSchema, where: TextWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TextUpdateManyAndReturnArgs>;

export const TextUpdateManyAndReturnZodSchema = z.object({ select: TextSelectObjectSchema.optional(), data: TextUpdateManyMutationInputObjectSchema, where: TextWhereInputObjectSchema.optional() }).strict();