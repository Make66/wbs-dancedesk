import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';

export const RoomFindUniqueSchema: z.ZodType<Prisma.RoomFindUniqueArgs> = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RoomFindUniqueArgs>;

export const RoomFindUniqueZodSchema = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema }).strict();