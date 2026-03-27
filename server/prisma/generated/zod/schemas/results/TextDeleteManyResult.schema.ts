import * as z from 'zod';
export const TextDeleteManyResultSchema = z.object({
  count: z.number()
});