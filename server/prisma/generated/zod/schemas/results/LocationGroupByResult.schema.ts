import * as z from 'zod';
export const LocationGroupByResultSchema = z.array(z.object({
  name: z.string(),
  imageUrl: z.string(),
  seq: z.number().int(),
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
  isDeleted: z.boolean(),
  _count: z.object({
    name: z.number(),
    imageUrl: z.number(),
    seq: z.number(),
    active: z.number(),
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
    seq: z.number().nullable(),
    longitude: z.number().nullable(),
    latitude: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    seq: z.number().nullable(),
    longitude: z.number().nullable(),
    latitude: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    seq: z.number().int().nullable(),
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
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    seq: z.number().int().nullable(),
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