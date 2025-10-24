import { telemetry } from '@chatbot/shared';

export interface LlmRequest {
  tenantId: string;
  prompt: string;
  context: string[];
  message: string;
}

export interface LlmResponse {
  reply: string;
  tokens: number;
}

export const invokeLlm = async ({ tenantId, prompt, context, message }: LlmRequest): Promise<LlmResponse> => {
  const synthesized = `${prompt}\nContext:${context.join('\n')}\nUser:${message}`;
  telemetry.track({ event: 'answer_generated', tenantId, promptLength: prompt.length });
  return { reply: `Synthetic response based on: ${synthesized.slice(0, 180)}`, tokens: synthesized.length / 4 };
};
