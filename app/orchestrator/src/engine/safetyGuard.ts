import { ESCALATION_KEYWORDS } from '@chatbot/shared';

export interface SafetyResult {
  safe: boolean;
  reason?: string;
}

export const runSafetyChecks = (message: string): SafetyResult => {
  const lower = message.toLowerCase();
  if (ESCALATION_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    return { safe: false, reason: 'escalation_keyword' };
  }
  return { safe: true };
};
