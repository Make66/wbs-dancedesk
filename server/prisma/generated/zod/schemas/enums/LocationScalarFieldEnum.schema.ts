import * as z from 'zod';

export const LocationScalarFieldEnumSchema = z.enum(['name', 'imageUrl', 'seq', 'active', 'street', 'city', 'zipCode', 'longitude', 'latitude', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type LocationScalarFieldEnum = z.infer<typeof LocationScalarFieldEnumSchema>;