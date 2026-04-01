import { z } from 'zod/v4';

export const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),

  setSeqTarget: z.array(z.uuid()).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  id: z.uuid(),
  tenantId: z.uuid().optional(),
  isDeleted: z.boolean().default(false)
});

locationSchema.partial({
  name: true,
  imageUrl: true,
  active: true,
  setSeqTarget: true,

  street: true,
  city: true,
  zipCode: true,
  longitude: true,
  latitude: true,

  isDeleted: true
});

export type Location = z.infer<typeof locationSchema>;