import * as z from 'zod';
export const CustomerFindManyResultSchema = z.object({
  data: z.array(z.object({
  name: z.string(),
  email: z.string(),
  website: z.string(),
  logoUrl: z.string(),
  primary: z.string(),
  secondary: z.string(),
  tertiary: z.string(),
  quaternary: z.string(),
  active: z.boolean(),
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});