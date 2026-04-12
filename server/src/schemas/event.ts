import { title } from "process";
import { z } from "zod/v4";

export const eventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  color: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.string())
  ).optional(),
  icon: z.string().optional(),
  type: z.string().optional(),

  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),

  roomId: z.uuid("Id given is not a valid UUID").optional(),
  locationId: z.uuid("Id given is not a valid UUID").optional(),
  targets: z.preprocess(
    (val) => (Array.isArray(val) ? val : typeof val === 'string' ? [val] : []),
    z.array(z.uuid("Id given is not a valid UUID"))
  ).optional(),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export type Event = z.infer<typeof eventSchema>;
