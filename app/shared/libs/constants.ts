export const TENANT_HEADER = 'x-tenant-id';
export const REQUEST_ID_HEADER = 'x-request-id';

export const DEFAULT_INTENTS = [
  'greeting',
  'product_inquiry',
  'booking',
  'support',
  'pricing',
  'escalation'
] as const;

export const ESCALATION_KEYWORDS = ['refund', 'harassment', 'legal dispute', 'chargeback', 'privacy concern'];
