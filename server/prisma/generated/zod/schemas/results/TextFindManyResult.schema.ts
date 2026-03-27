import * as z from 'zod';
export const TextFindManyResultSchema = z.object({
  data: z.array(z.object({
  name: z.string().optional(),
  type: z.number().int(),
  text: z.string(),
  courseTerms: z.array(z.unknown()),
  courseInfo: z.array(z.unknown()),
  courses: z.array(z.unknown()),
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