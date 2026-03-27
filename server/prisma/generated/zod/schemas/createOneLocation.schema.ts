import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationCreateInputObjectSchema as LocationCreateInputObjectSchema } from './objects/LocationCreateInput.schema';
import { LocationUncheckedCreateInputObjectSchema as LocationUncheckedCreateInputObjectSchema } from './objects/LocationUncheckedCreateInput.schema';

export const LocationCreateOneSchema: z.ZodType<Prisma.LocationCreateArgs> = z.object({ select: LocationSelectObjectSchema.optional(),  data: z.union([LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.LocationCreateArgs>;

export const LocationCreateOneZodSchema = z.object({ select: LocationSelectObjectSchema.optional(),  data: z.union([LocationCreateInputObjectSchema, LocationUncheckedCreateInputObjectSchema]) }).strict();