import { refresh } from '#controllers';
import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  email: z.email(),
  password: z.string().min(6).max(64),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),
  refreshToken: z.string().optional(),
  settings: z.json().default({}),

  locations : z.array(z.string()).default([]),
  modules: z.array(z.string()).default([]),

  tenantId: z.cuid()
});

export const registerSchema = userSchema
  .pick({ firstName: true, lastName: true, email: true, password: true })
  .extend({ tenantId: z.string().min(1) });

export const loginSchema = userSchema.pick({ email: true, password: true });

// kept for backward compatibility
export const signInSchema = loginSchema;
