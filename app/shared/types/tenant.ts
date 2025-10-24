export type TenantPlan = 'starter' | 'professional' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: TenantPlan;
  vectorIndex: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    tone: 'friendly' | 'professional' | 'warm';
    emojiUsage: 'casual' | 'none';
    primaryCta: string;
  };
}
