import { upsert } from '@chatbot/shared';
import { randomUUID } from 'crypto';

const TABLE = 'analytics';

export const recordConversationMetric = (
  tenantId: string,
  intent: string,
  latencyMs: number,
  resolution: 'contained' | 'handoff' | 'pending'
) => {
  upsert(tenantId, TABLE, { id: randomUUID(), tenantId, intent, latencyMs, resolution, createdAt: new Date() });
};
