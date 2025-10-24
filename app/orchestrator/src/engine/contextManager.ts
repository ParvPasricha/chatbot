import axios from 'axios';
import { getEnv } from '@chatbot/shared';

const env = getEnv();

export interface ContextResult {
  snippets: string[];
}

export const fetchContext = async (tenantId: string, query: string): Promise<ContextResult> => {
  const { data } = await axios.post(`${env.TOOLS_SERVICE_URL}/kb-search`, { tenantId, query, topK: 6 });
  return { snippets: data.results ?? [] };
};
