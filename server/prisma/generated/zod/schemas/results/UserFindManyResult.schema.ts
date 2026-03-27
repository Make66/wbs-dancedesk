import * as z from 'zod';
export const UserFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});