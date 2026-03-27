import * as z from 'zod';

export const RoomScalarFieldEnumSchema = z.enum(['name', 'imageUrl', 'capacity', 'active', 'id', 'tenantId', 'createdAt', 'updatedAt', 'isDeleted'])

export type RoomScalarFieldEnum = z.infer<typeof RoomScalarFieldEnumSchema>;