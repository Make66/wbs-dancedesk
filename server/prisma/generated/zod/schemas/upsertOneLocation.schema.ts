import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';
import { LocationCreateInputObjectSchema as LocationCreateInputObjectSchema } from './objects/LocationCreateInput.schema';
import { LocationUncheckedCreateInputObjectSchema as LocationUncheckedCreateInputObjectSchema } from './objects/LocationUncheckedCreateInput.schema';
import { LocationUpdateInputObjectSchema as LocationUpdateInputObjectSchema } from './objects/LocationUpdateInput.schema';
import { LocationUncheckedUpdateInputObjectSchema as LocationUncheckedUpdateInputObjectSchema } from './objects/LocationUncheckedUpdateInput.schema';

export const LocationUpsertOneSchema: z.ZodType<Prisma.LocationUpsertArgs> = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema, create: z.union([ LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema ]), update: z.union([ LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.LocationUpsertArgs>;

export const LocationUpsertOneZodSchema = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema, create: z.union([ LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema ]), update: z.union([ LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema ]) }).strict();