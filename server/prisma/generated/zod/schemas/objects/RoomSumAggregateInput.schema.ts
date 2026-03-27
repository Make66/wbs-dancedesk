import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  capacity: z.literal(true).optional()
}).strict();
export const RoomSumAggregateInputObjectSchema: z.ZodType<Prisma.RoomSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RoomSumAggregateInputType>;
export const RoomSumAggregateInputObjectZodSchema = makeSchema();
