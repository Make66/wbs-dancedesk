import * as z from 'zod';
export const UserUpdateResultSchema = z.nullable(z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string(),
  password: z.string(),
  imageUrl: z.string(),
  modules: z.array(z.string()),
  active: z.boolean(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean()
}));