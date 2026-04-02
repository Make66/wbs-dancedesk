import { refresh } from '#controllers';
import { id } from 'zod/locales';
import { z } from 'zod/v4';

export const userSchema = z.object({
  firstName: z.string().min(2).max(32),
  lastName: z.string().min(2).max(32),
  email: z.email(),
  password: z.string().min(6).max(64),
  imageUrl: z.string(),
  refreshToken: z.string(),
  settings: z.json().default({}),

  locations : z.array(z.string()).default([]),
  modules: z.array(z.string()).default([]),

  id: z.uuid('Id given is not a valid UUID'),
  tenantId: z.uuid('Id given is not a valid UUID'),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false)
});

userSchema.partial({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  imageUrl: true,
  refreshToken: true,
  settings: true,

  locations : true,
  modules: true,

  isActive: true,
  isDeleted: true,
  tenantId: true
});

export type User = z.infer<typeof userSchema>;

export const registerSchema = userSchema
  .pick({ firstName: true, lastName: true, email: true, password: true })
  .extend({ tenantId: z.string().min(1) });

export const loginSchema = userSchema.pick({ email: true, password: true });

// kept for backward compatibility
export const signInSchema = loginSchema;
