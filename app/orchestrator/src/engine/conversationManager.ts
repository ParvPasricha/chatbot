import { performance } from 'perf_hooks';
import { classifyIntent } from './intentClassifier';
import { fetchContext } from './contextManager';
import { buildPrompt } from './promptBuilder';
import { runSafetyChecks } from './safetyGuard';
import { invokeLlm } from '../services/llm.service';
import { recordConversationMetric } from '../services/analytics.service';
import { escalateToHuman } from '../services/handoff.service';
import { telemetry } from '../utils/telemetry';

interface ConversationInput {
  tenantId: string;
  message: string;
  businessProfile: Record<string, unknown>;
  brand: Record<string, unknown>;
  integrations: Record<string, unknown>;
  history: string[];
}

export const processConversation = async ({
  tenantId,
  message,
  businessProfile,
  brand,
  integrations,
  history,
}: ConversationInput) => {
  const start = performance.now();
  telemetry.track({ event: 'intent_classified', tenantId, phase: 'start' });

  const safety = runSafetyChecks(message);
  if (!safety.safe) {
    await escalateToHuman(tenantId, safety.reason ?? 'policy');
    recordConversationMetric(tenantId, 'escalation', performance.now() - start, 'handoff');
    return { reply: 'I will connect you with a human agent for further assistance.', intent: 'escalation', confidence: 1, toolInvocations: [] };
  }

  const prediction = classifyIntent(message);
  telemetry.track({ event: 'intent_classified', tenantId, intent: prediction.intent, confidence: prediction.confidence });

  const context = await fetchContext(tenantId, message);
  const prompt = buildPrompt({ business: businessProfile, tenant: { id: tenantId }, brand, env: 'prod', integrations });

  const llmResponse = await invokeLlm({ tenantId, prompt, context: [...history.slice(-5), ...context.snippets], message });

  if (prediction.escalation) {
    await escalateToHuman(tenantId, 'escalation_keyword');
  }

  recordConversationMetric(tenantId, prediction.intent, performance.now() - start, prediction.escalation ? 'handoff' : 'contained');

  return {
    reply: llmResponse.reply,
    intent: prediction.intent,
    confidence: prediction.confidence,
    toolInvocations: prediction.escalation ? [{ name: 'handoff_human', args: { reason: 'escalation_keyword' } }] : [],
  };
};
