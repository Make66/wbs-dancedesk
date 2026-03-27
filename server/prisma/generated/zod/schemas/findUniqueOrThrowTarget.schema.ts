import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';

export const TargetFindUniqueOrThrowSchema: z.ZodType<Prisma.TargetFindUniqueOrThrowArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TargetFindUniqueOrThrowArgs>;

export const TargetFindUniqueOrThrowZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema }).strict();