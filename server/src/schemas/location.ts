import { z } from 'zod/v4';

export const locationSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  seq: z.number().default(0),
  active: z.boolean().default(true),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional()
});



