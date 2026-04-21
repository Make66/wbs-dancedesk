import { z } from "zod/v4";

// FormData transmits booleans as the strings "true" / "false"
const booleanFromForm = z.preprocess(
  (v) => (typeof v === "string" ? v === "true" : v),
  z.boolean(),
);

export const postSchema = z.object({
  title:       z.string().min(2).max(200),
  teaser:      z.string().max(200).optional(),
  text:        z.string().max(1000).min(10),
  imageUrl:    z.url().optional(),
  author:      z.string().max(100).optional(),
  date:        z.iso.datetime().optional(),
  startsAt:    z.iso.datetime().optional(),
  endsAt:      z.iso.datetime().optional(),
  courseId:    z.uuid('Course ID must be a UUID').optional(),
  eventId:     z.uuid('Event ID must be a UUID').optional(),

  isActive:    booleanFromForm.default(true),
  isArchived:  booleanFromForm.default(false),
  isDeleted:   booleanFromForm.default(false),
});

export type Post = z.infer<typeof postSchema>;