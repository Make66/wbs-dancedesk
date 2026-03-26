import { z } from 'zod/v4';
import { categorySchema } from './category.ts';

export const targetSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional,
  seq: z.number().default(0),
  categories: z.array(categorySchema).min(1),
  active: z.boolean().default(true)
});


