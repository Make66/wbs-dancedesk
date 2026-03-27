import * as z from 'zod';
export const InstructorFindManyResultSchema = z.object({
  data: z.array(z.object({
  name: z.string().optional(),
  imageUrl: z.string(),
  active: z.boolean(),
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