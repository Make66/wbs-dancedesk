import { z } from 'zod/v4';

export const moduleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().default("#B5252B"),
  icon: z.string().optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Module = z.infer<typeof moduleSchema>;