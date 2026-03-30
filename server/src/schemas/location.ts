import { z } from 'zod/v4';
import { setSeqTargetSchema } from './target.ts';

export const setSeqLocationSchema = z.object({
  parent: z.uuid(),
  locations: z.array(z.uuid()),
});

export const locationSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),

  setSeqTarget: z.object({ setSeqTargetSchema }).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional()
});



