import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  capacity: z.literal(true).optional()
}).strict();
export const RoomAvgAggregateInputObjectSchema: z.ZodType<Prisma.RoomAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RoomAvgAggregateInputType>;
export const RoomAvgAggregateInputObjectZodSchema = makeSchema();
