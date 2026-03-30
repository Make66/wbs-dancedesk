import { z } from 'zod/v4';
import { setSeqLocationSchema } from './location.ts';
import { setSeqInstructorSchema } from './instructor.ts';

export const customerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  website: z.string().url(),
  logoUrl: z.string().optional(),
  primary: z.string().default("#B5252B"),
  secondary: z.string().default("#858384"),
  tertiary: z.string().default("#858384"),
  quaternary: z.string().default("#858384"),
  active: z.boolean().default(true),

  setSeqLocation: z.object({setSeqLocationSchema}).optional(),
  setSeqInstructor: z.object({setSeqInstructorSchema}).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional()
});



