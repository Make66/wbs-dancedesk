import { refresh } from '#controllers';
import { z } from 'zod/v4';

export const instructorSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  refreshToken: z.string().optional(),
  imageUrl: z.string().optional(),
  skills: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.string())
  ).optional(),

  customerId: z.uuid('Customer ID must be a UUID'),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Instructor = z.infer<typeof instructorSchema>;