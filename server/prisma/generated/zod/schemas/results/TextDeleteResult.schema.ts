import * as z from 'zod';
export const TextDeleteResultSchema = z.nullable(z.object({
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
}));