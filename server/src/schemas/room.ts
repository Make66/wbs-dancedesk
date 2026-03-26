import { z } from 'zod/v4';

export const roomSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional,
  capacity: z.number().optional,
  active: z.boolean().default(true),
  seq: z.number().default(0),

  street: z.string().optional,
  city: z.string().optional,
  zipCode: z.string().optional,
  longitude: z.number().optional,
  latitude: z.number().optional
});



