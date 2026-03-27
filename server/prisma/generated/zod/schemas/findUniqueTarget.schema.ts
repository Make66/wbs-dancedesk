import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';

export const TargetFindUniqueSchema: z.ZodType<Prisma.TargetFindUniqueArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TargetFindUniqueArgs>;

export const TargetFindUniqueZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict();