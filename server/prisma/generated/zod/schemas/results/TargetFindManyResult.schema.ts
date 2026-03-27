import * as z from 'zod';
export const TargetFindManyResultSchema = z.object({
  data: z.array(z.object({
  name: z.string().optional(),
  icon: z.string(),
  seq: z.number().int(),
  color: z.array(z.string()),
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