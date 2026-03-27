import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomWhereUniqueInputObjectSchema as RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCreateInputObjectSchema as RoomCreateInputObjectSchema } from './objects/RoomCreateInput.schema';
import { RoomUncheckedCreateInputObjectSchema as RoomUncheckedCreateInputObjectSchema } from './objects/RoomUncheckedCreateInput.schema';
import { RoomUpdateInputObjectSchema as RoomUpdateInputObjectSchema } from './objects/RoomUpdateInput.schema';
import { RoomUncheckedUpdateInputObjectSchema as RoomUncheckedUpdateInputObjectSchema } from './objects/RoomUncheckedUpdateInput.schema';

export const RoomUpsertOneSchema: z.ZodType<Prisma.RoomUpsertArgs> = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema, create: z.union([ RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema ]), update: z.union([ RoomUpdateInputObjectSchema, RoomUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.RoomUpsertArgs>;

export const RoomUpsertOneZodSchema = z.object({ select: RoomSelectObjectSchema.optional(),  where: RoomWhereUniqueInputObjectSchema, create: z.union([ RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema ]), update: z.union([ RoomUpdateInputObjectSchema, RoomUncheckedUpdateInputObjectSchema ]) }).strict();