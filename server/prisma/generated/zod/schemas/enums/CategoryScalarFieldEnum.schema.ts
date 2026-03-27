import * as z from 'zod';

export const CategoryScalarFieldEnumSchema = z.enum(['name', 'targetId', 'seq', 'color', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type CategoryScalarFieldEnum = z.infer<typeof CategoryScalarFieldEnumSchema>;