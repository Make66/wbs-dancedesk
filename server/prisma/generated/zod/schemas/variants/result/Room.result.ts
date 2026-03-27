import * as z from 'zod';
// prettier-ignore
export const RoomResultSchema = z.object({
    name: z.string().nullable(),
    imageUrl: z.string(),
    capacity: z.number().int(),
    active: z.boolean(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type RoomResultType = z.infer<typeof RoomResultSchema>;
