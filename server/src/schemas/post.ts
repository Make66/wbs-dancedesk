import { z } from "zod/v4";

export const postSchema = z.object({
  title:       z.string().optional(),
  teaser:      z.string().optional(),
  text:        z.string().optional(),
  imageUrl:    z.string().optional(),
  author:      z.string().optional(),
  date:        z.iso.datetime().optional(),
  startsAt:    z.iso.datetime().optional(),
  endsAt:      z.iso.datetime().optional(),
  courseId:    z.uuid('Course ID must be a UUID').optional(),
  eventId:     z.uuid('Event ID must be a UUID').optional(),
});

export type Post = z.infer<typeof postSchema>;