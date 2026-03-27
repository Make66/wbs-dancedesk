import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { LocationCreateManyInputObjectSchema as LocationCreateManyInputObjectSchema } from './objects/LocationCreateManyInput.schema';

export const LocationCreateManySchema: z.ZodType<Prisma.LocationCreateManyArgs> = z.object({ data: z.union([ LocationCreateManyInputObjectSchema, z.array(LocationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LocationCreateManyArgs>;

export const LocationCreateManyZodSchema = z.object({ data: z.union([ LocationCreateManyInputObjectSchema, z.array(LocationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();