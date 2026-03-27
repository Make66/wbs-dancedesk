import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationWhereInputObjectSchema as LocationWhereInputObjectSchema } from './objects/LocationWhereInput.schema';

export const LocationDeleteManySchema: z.ZodType<Prisma.LocationDeleteManyArgs> = z.object({ where: LocationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LocationDeleteManyArgs>;

export const LocationDeleteManyZodSchema = z.object({ where: LocationWhereInputObjectSchema.optional() }).strict();