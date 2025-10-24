import { TenantPlan } from '@chatbot/shared';

const planPricing: Record<TenantPlan, number> = {
  starter: 49,
  professional: 149,
  enterprise: 399,
};

export const calculateSubscription = (plan: TenantPlan, conversationCount: number) => {
  const base = planPricing[plan];
  const overage = Math.max(conversationCount - 1000, 0) * 0.01;
  return base + overage;
};
