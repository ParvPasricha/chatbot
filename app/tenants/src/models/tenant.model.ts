import { Tenant, TenantPlan } from '@chatbot/shared';

export interface TenantCreateInput {
  name: string;
  domain: string;
  plan: TenantPlan;
  vectorIndex?: string;
}

export type TenantRecord = Tenant;
