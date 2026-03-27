import * as z from 'zod';
export const RoomDeleteManyResultSchema = z.object({
  count: z.number()
});