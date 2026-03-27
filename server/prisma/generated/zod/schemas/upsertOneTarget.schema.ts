import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetWhereUniqueInputObjectSchema as TargetWhereUniqueInputObjectSchema } from './objects/TargetWhereUniqueInput.schema';
import { TargetCreateInputObjectSchema as TargetCreateInputObjectSchema } from './objects/TargetCreateInput.schema';
import { TargetUncheckedCreateInputObjectSchema as TargetUncheckedCreateInputObjectSchema } from './objects/TargetUncheckedCreateInput.schema';
import { TargetUpdateInputObjectSchema as TargetUpdateInputObjectSchema } from './objects/TargetUpdateInput.schema';
import { TargetUncheckedUpdateInputObjectSchema as TargetUncheckedUpdateInputObjectSchema } from './objects/TargetUncheckedUpdateInput.schema';

export const TargetUpsertOneSchema: z.ZodType<Prisma.TargetUpsertArgs> = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema, create: z.union([ TargetCreateInputObjectSchema, TargetUncheckedCreateInputObjectSchema ]), update: z.union([ TargetUpdateInputObjectSchema, TargetUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TargetUpsertArgs>;

export const TargetUpsertOneZodSchema = z.object({ select: TargetSelectObjectSchema.optional(),  where: TargetWhereUniqueInputObjectSchema, create: z.union([ TargetCreateInputObjectSchema, TargetUncheckedCreateInputObjectSchema ]), update: z.union([ TargetUpdateInputObjectSchema, TargetUncheckedUpdateInputObjectSchema ]) }).strict();