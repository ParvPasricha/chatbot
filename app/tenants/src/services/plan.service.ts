import { TenantPlan } from '@chatbot/shared';

export const getPlanLimits = (plan: TenantPlan) => {
  switch (plan) {
    case 'starter':
      return { conversations: 1000, channels: ['web'] };
    case 'professional':
      return { conversations: 5000, channels: ['web', 'whatsapp', 'facebook'] };
    case 'enterprise':
      return { conversations: Infinity, channels: ['web', 'whatsapp', 'facebook'] };
    default:
      return { conversations: 0, channels: [] };
  }
};
