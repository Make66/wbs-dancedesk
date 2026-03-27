import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TextSelectObjectSchema as TextSelectObjectSchema } from './objects/TextSelect.schema';
import { TextIncludeObjectSchema as TextIncludeObjectSchema } from './objects/TextInclude.schema';
import { TextWhereUniqueInputObjectSchema as TextWhereUniqueInputObjectSchema } from './objects/TextWhereUniqueInput.schema';

export const TextDeleteOneSchema: z.ZodType<Prisma.TextDeleteArgs> = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), where: TextWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TextDeleteArgs>;

export const TextDeleteOneZodSchema = z.object({ select: TextSelectObjectSchema.optional(), include: TextIncludeObjectSchema.optional(), where: TextWhereUniqueInputObjectSchema }).strict();