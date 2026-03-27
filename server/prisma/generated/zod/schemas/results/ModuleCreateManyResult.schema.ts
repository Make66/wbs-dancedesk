import * as z from 'zod';
export const ModuleCreateManyResultSchema = z.object({
  count: z.number()
});