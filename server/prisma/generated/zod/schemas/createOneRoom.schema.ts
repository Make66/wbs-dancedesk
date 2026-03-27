import type { Prisma } from '../../../../generated/prisma/client';
import * as z from 'zod';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomCreateInputObjectSchema as RoomCreateInputObjectSchema } from './objects/RoomCreateInput.schema';
import { RoomUncheckedCreateInputObjectSchema as RoomUncheckedCreateInputObjectSchema } from './objects/RoomUncheckedCreateInput.schema';

export const RoomCreateOneSchema: z.ZodType<Prisma.RoomCreateArgs> = z.object({ select: RoomSelectObjectSchema.optional(),  data: z.union([RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.RoomCreateArgs>;

export const RoomCreateOneZodSchema = z.object({ select: RoomSelectObjectSchema.optional(),  data: z.union([RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema]) }).strict();