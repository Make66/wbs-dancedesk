import * as z from 'zod';
export const RoomUpsertResultSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string(),
  capacity: z.number().int(),
  active: z.boolean(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean()
});