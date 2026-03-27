import * as z from 'zod';
export const RoomGroupByResultSchema = z.array(z.object({
  name: z.string(),
  imageUrl: z.string(),
  capacity: z.number().int(),
  active: z.boolean(),
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDeleted: z.boolean(),
  _count: z.object({
    name: z.number(),
    imageUrl: z.number(),
    capacity: z.number(),
    active: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _sum: z.object({
    capacity: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    capacity: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    capacity: z.number().int().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    capacity: z.number().int().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));