import { z } from 'zod/v4';

export const customerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
  primary: z.string().default("#B5252B").optional(),
  secondary: z.string().default("#858384").optional(),
  tertiary: z.string().default("#858384").optional(),
  quaternary: z.string().default("#858384").optional(),
  signInKey: z.string().max(5).optional(),
  apiKey: z.string().optional(),
  
  setSeqLocation: z.array(z.uuid('Id given is not a valid UUID')).optional(),
  setSeqInstructor: z.array(z.uuid('Id given is not a valid UUID')).optional(),
  
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Customer = z.infer<typeof customerSchema>;

