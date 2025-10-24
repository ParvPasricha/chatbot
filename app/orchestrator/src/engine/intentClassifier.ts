import { DEFAULT_INTENTS, ESCALATION_KEYWORDS } from '@chatbot/shared';

export interface IntentPrediction {
  intent: string;
  confidence: number;
  escalation: boolean;
}

const keywordMap: Record<string, string[]> = {
  product_inquiry: ['price', 'cost', 'availability', 'product', 'menu'],
  booking: ['book', 'reserve', 'appointment'],
  support: ['help', 'issue', 'problem', 'support'],
  pricing: ['pricing', 'quote', 'rate'],
};

export const classifyIntent = (message: string): IntentPrediction => {
  const text = message.toLowerCase();
  for (const intent of Object.keys(keywordMap)) {
    if (keywordMap[intent].some((keyword) => text.includes(keyword))) {
      return {
        intent,
        confidence: 0.8,
        escalation: ESCALATION_KEYWORDS.some((keyword) => text.includes(keyword)),
      };
    }
  }
  return {
    intent: DEFAULT_INTENTS[0],
    confidence: 0.5,
    escalation: ESCALATION_KEYWORDS.some((keyword) => text.includes(keyword)),
  };
};
