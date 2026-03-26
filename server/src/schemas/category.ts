import { z } from 'zod/v4';

export const categorySchema = z.object({
  name: z.string().min(1),
  target: z.uuid(),
  seq: z.number().default(0),
  active: z.boolean().default(true)
});



