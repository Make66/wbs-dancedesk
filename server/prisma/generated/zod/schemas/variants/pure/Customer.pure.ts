import * as z from 'zod';
// prettier-ignore
export const CustomerModelSchema = z.object({
    name: z.string(),
    email: z.string(),
    website: z.string(),
    logoUrl: z.string(),
    primary: z.string(),
    secondary: z.string(),
    tertiary: z.string(),
    quaternary: z.string(),
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

export type CustomerPureType = z.infer<typeof CustomerModelSchema>;
