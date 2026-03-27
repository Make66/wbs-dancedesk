import * as z from 'zod';
export const TextCreateManyResultSchema = z.object({
  count: z.number()
});