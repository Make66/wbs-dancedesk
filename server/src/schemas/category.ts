import { z } from 'zod/v4';

export const categorySchema = z.object({
  name: z.string().min(1),
  target: z.uuid(),
  color: z.array(z.string()).default(['#000000', '#FFFFFF']),
  active: z.boolean().default(true),

  setSeqCourse: z.array(z.uuid()).optional(),
});
