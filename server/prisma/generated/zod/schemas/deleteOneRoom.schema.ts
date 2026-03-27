import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';

export const RoomDeleteOneSchema: z.ZodType<Prisma.RoomDeleteArgs> = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RoomDeleteArgs>;

export const RoomDeleteOneZodSchema = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema }).strict();