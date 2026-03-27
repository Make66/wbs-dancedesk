import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomUpdateManyMutationInputObjectSchema as RoomUpdateManyMutationInputObjectSchema } from './objects/RoomUpdateManyMutationInput.schema';
import { RoomWhereInputObjectSchema as RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomUpdateManyAndReturnSchema: z.ZodType<Prisma.RoomUpdateManyAndReturnArgs> = z.object({ select: RoomSelectObjectSchema.optional(), data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoomUpdateManyAndReturnArgs>;

export const RoomUpdateManyAndReturnZodSchema = z.object({ select: RoomSelectObjectSchema.optional(), data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional() }).strict();