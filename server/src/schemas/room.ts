import { z } from 'zod/v4';

export const roomSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  capacity: z.number().optional(),

  courses: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  events: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  location: z.uuid('Id given is not a valid UUID').optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Room = z.infer<typeof roomSchema>;