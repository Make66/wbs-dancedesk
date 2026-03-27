import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './objects/TextInclude.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';
import { TextCreateInputObjectSchema as TextCreateInputObjectSchema } from './objects/TextCreateInput.schema';
import { TextUncheckedCreateInputObjectSchema as TextUncheckedCreateInputObjectSchema } from './objects/TextUncheckedCreateInput.schema';
import { TextUpdateInputObjectSchema as TextUpdateInputObjectSchema } from './objects/TextUpdateInput.schema';
import { TextUncheckedUpdateInputObjectSchema as TextUncheckedUpdateInputObjectSchema } from './objects/TextUncheckedUpdateInput.schema';

export const TextUpsertOneSchema: z.ZodType<Prisma.TextUpsertArgs> = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), where: TextWhereUniqueInputObjectSchema, create: z.union([ TextCreateInputObjectSchema, TextUncheckedCreateInputObjectSchema ]), update: z.union([ TextUpdateInputObjectSchema, TextUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TextUpsertArgs>;

export const TextUpsertOneZodSchema = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), where: TextWhereUniqueInputObjectSchema, create: z.union([ TextCreateInputObjectSchema, TextUncheckedCreateInputObjectSchema ]), update: z.union([ TextUpdateInputObjectSchema, TextUncheckedUpdateInputObjectSchema ]) }).strict();