import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';

export const LocationDeleteOneSchema: z.ZodType<Prisma.LocationDeleteArgs> = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LocationDeleteArgs>;

export const LocationDeleteOneZodSchema = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema }).strict();