import { text } from 'stream/consumers';
import { z } from 'zod/v4';

export const textSchema = z.object({
  name: z.string().min(1),
  type: z.number().min(0),
  text: z.string().optional(),

  seq: z.number().default(0),
  active: z.boolean().default(true)
});



