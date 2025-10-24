import axios from 'axios';
import { getEnv, telemetry } from '@chatbot/shared';

const env = getEnv();

export const searchKnowledgeBase = async (tenantId: string, query: string) => {
  telemetry.track({ event: 'tool_invoked', tenantId, tool: 'search_kb' });
  const { data } = await axios.post(`${env.TOOLS_SERVICE_URL}/kb-search`, { tenantId, query, topK: 6 });
  return data.results ?? [];
};

export const fetchProduct = async (tenantId: string, args: Record<string, unknown>) => {
  telemetry.track({ event: 'tool_invoked', tenantId, tool: 'fetch_product' });
  const { data } = await axios.post(`${env.TOOLS_SERVICE_URL}/product`, { tenantId, ...args });
  return data.product;
};

export const createLead = async (tenantId: string, args: Record<string, unknown>) => {
  telemetry.track({ event: 'lead_created', tenantId, tool: 'create_lead' });
  await axios.post(`${env.TOOLS_SERVICE_URL}/lead`, { tenantId, ...args });
};

export const handoffHuman = async (tenantId: string, args: Record<string, unknown>) => {
  telemetry.track({ event: 'escalation_triggered', tenantId, tool: 'handoff_human' });
  await axios.post(`${env.TOOLS_SERVICE_URL}/handoff`, { tenantId, ...args });
};
