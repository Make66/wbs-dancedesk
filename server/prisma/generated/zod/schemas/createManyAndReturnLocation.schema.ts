import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationSelectObjectSchema as LocationSelectObjectSchema } from './objects/LocationSelect.schema';
import { LocationCreateManyInputObjectSchema as LocationCreateManyInputObjectSchema } from './objects/LocationCreateManyInput.schema';

export const LocationCreateManyAndReturnSchema: z.ZodType<Prisma.LocationCreateManyAndReturnArgs> = z.object({ select: LocationSelectObjectSchema.optional(), data: z.union([ LocationCreateManyInputObjectSchema, z.array(LocationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LocationCreateManyAndReturnArgs>;

export const LocationCreateManyAndReturnZodSchema = z.object({ select: LocationSelectObjectSchema.optional(), data: z.union([ LocationCreateManyInputObjectSchema, z.array(LocationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();