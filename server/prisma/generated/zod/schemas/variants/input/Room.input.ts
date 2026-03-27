import * as z from 'zod';
// prettier-ignore
export const RoomInputSchema = z.object({
    name: z.string().optional().nullable(),
    imageUrl: z.string(),
    capacity: z.number().int(),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type RoomInputType = z.infer<typeof RoomInputSchema>;
