import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { UserCreatemodulesInputObjectSchema as UserCreatemodulesInputObjectSchema } from './UserCreatemodulesInput.schema'

const makeSchema = () => z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().optional(),
  password: z.string().optional(),
  imageUrl: z.string().optional(),
  modules: z.union([z.lazy(() => UserCreatemodulesInputObjectSchema), z.string().array()]).optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.coerce.date().optional(),
  isDeleted: z.boolean().optional()
}).strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
