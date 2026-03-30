import { z } from 'zod/v4';
import { categorySchema, setSeqCategorySchema } from './category.ts';

export const setSeqTargetSchema = z.object({
  parent: z.uuid(),
  targets: z.array(z.uuid()),
});

export const targetSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  categories: z.array(categorySchema).optional(),
  color: z.array(z.string()).default(['#000000', '#FFFFFF']),
  active: z.boolean().default(true),
  
  setSeqCategory: z.object({ setSeqCategorySchema }).optional(),
});
