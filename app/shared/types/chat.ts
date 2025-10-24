export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatRequest {
  tenantId: string;
  conversationId: string;
  message: string;
  userId?: string;
  channel?: 'web' | 'whatsapp' | 'facebook';
  locale?: string;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  reply: string;
  intent: string;
  confidence: number;
  toolInvocations: Array<{ name: string; args: Record<string, unknown> }>;
}
