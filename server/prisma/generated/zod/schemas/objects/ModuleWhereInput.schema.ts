import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const modulewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ModuleWhereInputObjectSchema), z.lazy(() => ModuleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ModuleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ModuleWhereInputObjectSchema), z.lazy(() => ModuleWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  seq: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  color: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tenantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  isDeleted: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const ModuleWhereInputObjectSchema: z.ZodType<Prisma.ModuleWhereInput> = modulewhereinputSchema as unknown as z.ZodType<Prisma.ModuleWhereInput>;
export const ModuleWhereInputObjectZodSchema = modulewhereinputSchema;
