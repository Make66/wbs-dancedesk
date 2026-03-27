import * as z from 'zod';

export const TargetScalarFieldEnumSchema = z.enum(['name', 'icon', 'seq', 'color', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type TargetScalarFieldEnum = z.infer<typeof TargetScalarFieldEnumSchema>;