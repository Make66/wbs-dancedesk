import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetSelectObjectSchema as TargetSelectObjectSchema } from './objects/TargetSelect.schema';
import { TargetUpdateManyMutationInputObjectSchema as TargetUpdateManyMutationInputObjectSchema } from './objects/TargetUpdateManyMutationInput.schema';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';

export const TargetUpdateManyAndReturnSchema: z.ZodType<Prisma.TargetUpdateManyAndReturnArgs> = z.object({ select: TargetSelectObjectSchema.optional(), data: TargetUpdateManyMutationInputObjectSchema, where: TargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TargetUpdateManyAndReturnArgs>;

export const TargetUpdateManyAndReturnZodSchema = z.object({ select: TargetSelectObjectSchema.optional(), data: TargetUpdateManyMutationInputObjectSchema, where: TargetWhereInputObjectSchema.optional() }).strict();