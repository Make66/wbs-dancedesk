import { z } from 'zod/v4';

export const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),

  setSeqTarget: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ),
  courses: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  customer: z.uuid('Id given is not a valid UUID').optional(),
  events: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  targets: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  users: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),
  rooms: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid('Id given is not a valid UUID'))
  ).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Location = z.infer<typeof locationSchema>;