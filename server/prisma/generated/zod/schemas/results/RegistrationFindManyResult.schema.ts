import * as z from 'zod';
export const RegistrationFindManyResultSchema = z.object({
  data: z.array(z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
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