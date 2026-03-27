import * as z from 'zod';
export const TextAggregateResultSchema = z.object({  _count: z.object({
    name: z.number(),
    type: z.number(),
    text: z.number(),
    courseTerms: z.number(),
    courseInfo: z.number(),
    courses: z.number(),
    id: z.number(),
    tenantId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    isDeleted: z.number()
  }).optional(),
  _sum: z.object({
    type: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    type: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    name: z.string().nullable(),
    type: z.number().int().nullable(),
    text: z.string().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    name: z.string().nullable(),
    type: z.number().int().nullable(),
    text: z.string().nullable(),
    id: z.string().nullable(),
    tenantId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});