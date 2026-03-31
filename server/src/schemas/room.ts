import { z } from 'zod/v4';

export const roomSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  capacity: z.number().optional(),
  active: z.boolean().default(true),
  
  courses: z.array(z.uuid()).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional,

  id: z.uuid(),
  tenantId: z.uuid(),
  isDeleted: z.boolean().default(false)
});

roomSchema.partial({
  name: true,
  imageUrl: true,
  capacity: true,
  active: true,
  courses: true,

  street: true,
  city: true,
  zipCode: true,
  longitude: true,
  latitude: true,

  isDeleted: true
});

export type Room = z.infer<typeof roomSchema>;