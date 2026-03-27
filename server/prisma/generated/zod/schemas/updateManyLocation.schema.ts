import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationUpdateManyMutationInputObjectSchema as LocationUpdateManyMutationInputObjectSchema } from './objects/LocationUpdateManyMutationInput.schema';
import { LocationWhereInputObjectSchema as LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';

export const LocationUpdateManySchema: z.ZodType<Prisma.LocationUpdateManyArgs> = z.object({ data: LocationUpdateManyMutationInputObjectSchema, where: LocationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LocationUpdateManyArgs>;

export const LocationUpdateManyZodSchema = z.object({ data: LocationUpdateManyMutationInputObjectSchema, where: LocationWhereInputObjectSchema.optional() }).strict();