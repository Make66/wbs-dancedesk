import { z } from 'zod/v4';

export const participantSchema = z.object({
  firstName: z.string().min(2).max(32).optional(),
  lastName: z.string().min(2).max(32).optional(),
  email: z.email().optional(),
  password: z.string().min(6).max(64).optional(),
  imageUrl: z.string().optional(),
  birthDate: z.string().optional(),
  refreshToken: z.string().optional(),
  settings: z.json().default({}).optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Participant = z.infer<typeof participantSchema>;

export const registerSchema = participantSchema
  .pick({ firstName: true, lastName: true, email: true, password: true })
  .extend({ tenantId: z.string().min(1) });

export const loginSchema = participantSchema.pick({ email: true, password: true });

// kept for backward compatibility
export const signInSchema = loginSchema;
