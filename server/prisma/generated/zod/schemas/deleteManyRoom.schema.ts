import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomDeleteManySchema: z.ZodType<Prisma.RoomDeleteManyArgs> = z.object({ where: RoomWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoomDeleteManyArgs>;

export const RoomDeleteManyZodSchema = z.object({ where: RoomWhereInputObjectSchema.optional() }).strict();