import { z } from 'zod/v4';

export const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  imageUrl: z.string(),

  setSeqTarget: z.array(z.uuid('Id given is not a valid UUID')),

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

locationSchema.partial({
description: true,
  imageUrl: true,
  setSeqTarget: true,

  street: true,
  city: true,
  zipCode: true,
  longitude: true,
  latitude: true,

  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type Location = z.infer<typeof locationSchema>;