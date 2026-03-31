import { z } from 'zod/v4';

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

  setSeqLocation: z.array(z.uuid()).optional(),
  setSeqInstructor: z.array(z.uuid()).optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  id: z.uuid(),
  tenantId: z.uuid(),
  isDeleted: z.boolean().default(false)
});

customerSchema.partial({
  name: true,
  email: true,
  website: true,
  logoUrl: true,
  primary: true,
  secondary: true,
  tertiary: true,
  quaternary: true,
  active: true,

  setSeqLocation: true,
  setSeqInstructor: true,

  street: true,
  city: true,
  zipCode: true,
  longitude: true,
  latitude: true,

  isDeleted: true
});

export type Customer = z.infer<typeof customerSchema>;

