import * as z from 'zod';
export const InstructorFindUniqueResultSchema = z.nullable(z.object({
  name: z.string().optional(),
  imageUrl: z.string(),
  active: z.boolean(),
  courses: z.array(z.unknown()),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean()
}));