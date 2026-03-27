import * as z from 'zod';
export const InstructorAggregateResultSchema = z.object({  _count: z.object({
    name: z.number(),
    imageUrl: z.number(),
    active: z.number(),
    courses: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _min: z.object({
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    name: z.string().nullable(),
    imageUrl: z.string().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});