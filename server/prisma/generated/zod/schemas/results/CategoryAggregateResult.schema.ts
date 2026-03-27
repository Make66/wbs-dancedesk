import * as z from 'zod';
export const CategoryAggregateResultSchema = z.object({  _count: z.object({
    name: z.number(),
    target: z.number(),
    targetId: z.number(),
    seq: z.number(),
    color: z.number(),
    active: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _sum: z.object({
    seq: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    seq: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    name: z.string().nullable(),
    targetId: z.string().nullable(),
    seq: z.number().int().nullable(),
    color: z.array(z.string()).nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    name: z.string().nullable(),
    targetId: z.string().nullable(),
    seq: z.number().int().nullable(),
    color: z.array(z.string()).nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});