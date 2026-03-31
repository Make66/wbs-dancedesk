import { z } from 'zod/v4';
import { categorySchema } from './category.ts';

export const targetSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  categories: z.array(categorySchema).optional(),
  color: z.array(z.string()).default(['#D1D5DC', '#000000']),
  active: z.boolean().default(true),
  
  setSeqCategory: z.array(z.uuid()).optional(),

  id: z.uuid(),
  tenantId: z.uuid()
});
