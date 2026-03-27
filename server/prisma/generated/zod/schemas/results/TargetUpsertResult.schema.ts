import * as z from 'zod';
export const TargetUpsertResultSchema = z.object({
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
});