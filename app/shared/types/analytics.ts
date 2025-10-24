export interface ConversationMetric {
  tenantId: string;
  conversationId: string;
  intent: string;
  latencyMs: number;
  resolution: 'contained' | 'handoff' | 'pending';
  satisfactionScore?: number;
  createdAt: string;
}
