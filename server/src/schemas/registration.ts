import { z } from 'zod/v4';

export const registrationSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().max(20).optional(),

  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  seq: z.number().default(0),
  active: z.boolean().default(true)
});



