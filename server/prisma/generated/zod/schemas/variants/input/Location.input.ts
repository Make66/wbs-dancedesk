import * as z from 'zod';
// prettier-ignore
export const LocationInputSchema = z.object({
    name: z.string().optional().nullable(),
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

export type LocationInputType = z.infer<typeof LocationInputSchema>;
