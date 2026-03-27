import * as z from 'zod';
// prettier-ignore
export const LocationModelSchema = z.object({
    name: z.string().nullable(),
    imageUrl: z.string(),
    seq: z.number().int(),
    active: z.boolean(),
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
    longitude: z.number(),
    latitude: z.number(),
    id: z.string(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    isDeleted: z.boolean()
}).strict();

export type LocationPureType = z.infer<typeof LocationModelSchema>;
