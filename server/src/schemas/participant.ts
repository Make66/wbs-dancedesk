import { z } from 'zod/v4';

export const participantSchema = z.object({
  firstName: z.string().min(2).max(32).optional(),
  lastName: z.string().min(2).max(32).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).max(64).optional(),
  imageUrl: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).default("other").optional(),
  refreshToken: z.string().optional(),
  settings: z.json().default({}).optional(),
  
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type Participant = z.infer<typeof participantSchema>;
