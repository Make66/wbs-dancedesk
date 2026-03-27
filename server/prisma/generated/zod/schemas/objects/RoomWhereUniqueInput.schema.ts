import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const RoomWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoomWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RoomWhereUniqueInput>;
export const RoomWhereUniqueInputObjectZodSchema = makeSchema();
