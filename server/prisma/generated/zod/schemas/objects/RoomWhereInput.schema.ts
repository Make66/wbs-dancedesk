import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const roomwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoomWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoomWhereInputObjectSchema), z.lazy(() => RoomWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  imageUrl: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  capacity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const RoomWhereInputObjectSchema: z.ZodType<Prisma.RoomWhereInput> = roomwhereinputSchema as unknown as z.ZodType<Prisma.RoomWhereInput>;
export const RoomWhereInputObjectZodSchema = roomwhereinputSchema;
