import { z } from 'zod/v4';

export const newsSchema = z.object({
  news: z.string().optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type News = z.infer<typeof newsSchema>;