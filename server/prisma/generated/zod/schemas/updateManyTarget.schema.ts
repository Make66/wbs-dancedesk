import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { TargetUpdateManyMutationInputObjectSchema as TargetUpdateManyMutationInputObjectSchema } from './objects/TargetUpdateManyMutationInput.schema';
import { TargetWhereInputObjectSchema as TargetWhereInputObjectSchema } from './objects/TargetWhereInput.schema';

export const TargetUpdateManySchema: z.ZodType<Prisma.TargetUpdateManyArgs> = z.object({ data: TargetUpdateManyMutationInputObjectSchema, where: TargetWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TargetUpdateManyArgs>;

export const TargetUpdateManyZodSchema = z.object({ data: TargetUpdateManyMutationInputObjectSchema, where: TargetWhereInputObjectSchema.optional() }).strict();