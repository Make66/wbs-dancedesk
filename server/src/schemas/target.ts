import { z } from 'zod/v4';
import { categorySchema } from './category.ts';

export const targetSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  seq: z.number().default(0),
  categories: z.array(categorySchema).min(1),
  color: z.array(z.string()).default(['#000000', '#FFFFFF']),
  active: z.boolean().default(true)
});
