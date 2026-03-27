import * as z from 'zod';
export const RegistrationGroupByResultSchema = z.array(z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean(),
  _count: z.object({
    firstName: z.number(),
    lastName: z.number(),
    email: z.number(),
    phone: z.number(),
    street: z.number(),
    city: z.number(),
    zipCode: z.number(),
    longitude: z.number(),
    latitude: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _sum: z.object({
    longitude: z.number().nullable(),
    latitude: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    longitude: z.number().nullable(),
    latitude: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    street: z.string().nullable(),
    city: z.string().nullable(),
    zipCode: z.string().nullable(),
    longitude: z.number().nullable(),
    latitude: z.number().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    street: z.string().nullable(),
    city: z.string().nullable(),
    zipCode: z.string().nullable(),
    longitude: z.number().nullable(),
    latitude: z.number().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));