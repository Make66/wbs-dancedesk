import * as z from 'zod';
export const UserAggregateResultSchema = z.object({  _count: z.object({
    firstName: z.number(),
    lastName: z.number(),
    email: z.number(),
    password: z.number(),
    imageUrl: z.number(),
    modules: z.number(),
    active: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _min: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    password: z.string().nullable(),
    imageUrl: z.string().nullable(),
    modules: z.array(z.string()).nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    password: z.string().nullable(),
    imageUrl: z.string().nullable(),
    modules: z.array(z.string()).nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});