import * as z from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['name', 'email', 'website', 'logoUrl', 'primary', 'secondary', 'tertiary', 'quaternary', 'active', 'street', 'city', 'zipCode', 'longitude', 'latitude', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type CustomerScalarFieldEnum = z.infer<typeof CustomerScalarFieldEnumSchema>;