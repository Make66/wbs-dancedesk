import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomUpdateManyMutationInputObjectSchema as RoomUpdateManyMutationInputObjectSchema } from './objects/RoomUpdateManyMutationInput.schema';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomUpdateManySchema: z.ZodType<Prisma.RoomUpdateManyArgs> = z.object({ data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoomUpdateManyArgs>;

export const RoomUpdateManyZodSchema = z.object({ data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional() }).strict();