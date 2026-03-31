import { z } from 'zod/v4';

export const textSchema = z.object({
  name: z.string().min(1),
  type: z.number().min(0),
  text: z.string().optional(),
  active: z.boolean().default(true),

  // relations
  courseInfo: z.array(z.uuid()).optional(),
  courseTerms: z.array(z.uuid()).optional(),
  
  id: z.uuid(),
  tenantId: z.uuid()
});


