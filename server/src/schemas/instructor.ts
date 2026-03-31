import { z } from 'zod/v4';

export const instructorSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),

  id: z.uuid(),
  tenantId: z.uuid()
});
