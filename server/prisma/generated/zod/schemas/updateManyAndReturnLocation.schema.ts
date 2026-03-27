import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationUpdateManyMutationInputObjectSchema as LocationUpdateManyMutationInputObjectSchema } from './objects/LocationUpdateManyMutationInput.schema';
import { LocationWhereInputObjectSchema as LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';

export const LocationUpdateManyAndReturnSchema: z.ZodType<Prisma.LocationUpdateManyAndReturnArgs> = z.object({ select: LocationSelectObjectSchema.optional(), data: LocationUpdateManyMutationInputObjectSchema, where: LocationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LocationUpdateManyAndReturnArgs>;

export const LocationUpdateManyAndReturnZodSchema = z.object({ select: LocationSelectObjectSchema.optional(), data: LocationUpdateManyMutationInputObjectSchema, where: LocationWhereInputObjectSchema.optional() }).strict();