import * as z from 'zod';
export const ModuleUpdateResultSchema = z.nullable(z.object({
  name: z.string(),
  seq: z.number().int(),
  color: z.string(),
  active: z.boolean(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean()
}));