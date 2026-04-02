import { z } from 'zod/v4';

export const roomSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  imageUrl: z.string(),
  capacity: z.number(),
  
  courses: z.array(z.uuid('Id given is not a valid UUID')),

  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  longitude: z.number(),
  latitude: z.number(),

  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID'),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false)
});

roomSchema.partial({
  description: true,
  imageUrl: true,
  capacity: true,
  courses: true,

  street: true,
  city: true,
  zipCode: true,
  longitude: true,
  latitude: true,

  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type Room = z.infer<typeof roomSchema>;