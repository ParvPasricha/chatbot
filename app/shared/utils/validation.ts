import { z } from 'zod';

export const chatRequestSchema = z.object({
  tenantId: z.string().uuid(),
  conversationId: z.string().uuid(),
  message: z.string().min(1).max(4000),
  userId: z.string().optional(),
  channel: z.enum(['web', 'whatsapp', 'facebook']).optional(),
  locale: z.string().optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export const validate = <T>(schema: z.ZodSchema<T>, payload: unknown): T => schema.parse(payload);
