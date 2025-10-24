import { handoffHuman } from './tools.service';

export const escalateToHuman = async (tenantId: string, reason: string) => {
  await handoffHuman(tenantId, { reason, priority: 'high' });
};
