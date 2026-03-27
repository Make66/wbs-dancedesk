import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomCreateManyInputObjectSchema as RoomCreateManyInputObjectSchema } from './objects/RoomCreateManyInput.schema';

export const RoomCreateManySchema: z.ZodType<Prisma.RoomCreateManyArgs> = z.object({ data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RoomCreateManyArgs>;

export const RoomCreateManyZodSchema = z.object({ data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();