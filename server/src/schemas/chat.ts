import { z } from 'zod/v4';

export const chatSessionSchema = z.object({
  participantId: z.uuid('Participant ID must be a UUID'),
  tenantId:      z.string().min(1),
  domain:        z.url().optional(),
});

export const chatMessageSchema = z.object({
  sessionId: z.uuid('Session ID must be a UUID'),
  prompt:    z.string().min(1).max(2000),
});

export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
