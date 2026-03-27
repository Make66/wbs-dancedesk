import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationWhereUniqueInputObjectSchema as LocationWhereUniqueInputObjectSchema } from './objects/LocationWhereUniqueInput.schema';

export const LocationFindUniqueSchema: z.ZodType<Prisma.LocationFindUniqueArgs> = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LocationFindUniqueArgs>;

export const LocationFindUniqueZodSchema = z.object({ select: LocationSelectObjectSchema.optional(),  where: LocationWhereUniqueInputObjectSchema }).strict();