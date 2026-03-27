import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomCreateManyInputObjectSchema as RoomCreateManyInputObjectSchema } from './objects/RoomCreateManyInput.schema';

export const RoomCreateManyAndReturnSchema: z.ZodType<Prisma.RoomCreateManyAndReturnArgs> = z.object({ select: RoomSelectObjectSchema.optional(), data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RoomCreateManyAndReturnArgs>;

export const RoomCreateManyAndReturnZodSchema = z.object({ select: RoomSelectObjectSchema.optional(), data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();