import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationUpdateInputObjectSchema as LocationUpdateInputObjectSchema } from './objects/LocationUpdateInput.schema';
import { LocationUncheckedUpdateInputObjectSchema as LocationUncheckedUpdateInputObjectSchema } from './objects/LocationUncheckedUpdateInput.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';

export const LocationUpdateOneSchema: z.ZodType<Prisma.LocationUpdateArgs> = z.object({ select: LocationSelectObjectSchema.optional(),  data: z.union([LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema]), where: LocationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LocationUpdateArgs>;

export const LocationUpdateOneZodSchema = z.object({ select: LocationSelectObjectSchema.optional(),  data: z.union([LocationUpdateInputObjectSchema, LocationUncheckedUpdateInputObjectSchema]), where: LocationWhereUniqueInputObjectSchema }).strict();