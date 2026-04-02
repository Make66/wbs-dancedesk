import { refresh } from '#controllers';
import { id } from 'zod/locales';
import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(2).max(32).optional(),
  lastName: z.string().min(2).max(32).optional(),
  email: z.email().optional(),
  password: z.string().min(6).max(64).optional(),
  imageUrl: z.string().optional(),
  refreshToken: z.string().optional(),
  settings: z.json().default({}).optional(),

  locations : z.array(z.string()).default([]).optional(),
  modules: z.array(z.string()).default([]).optional(),

  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID').optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});

export type User = z.infer<typeof userSchema>;

export const registerSchema = userSchema
  .pick({ firstName: true, lastName: true, email: true, password: true })
  .extend({ tenantId: z.string().min(1) });

export const loginSchema = userSchema.pick({ email: true, password: true });

// kept for backward compatibility
export const signInSchema = loginSchema;
