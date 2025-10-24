import { randomUUID } from 'crypto';
import { upsert, findAll, find } from '@chatbot/shared';
import { TenantRecord, TenantCreateInput } from '../models/tenant.model';

const TABLE = 'tenants';
const SCOPE = 'global';

export const createTenant = (input: TenantCreateInput): TenantRecord => {
  const now = new Date().toISOString();
  const tenant: TenantRecord = {
    id: randomUUID(),
    name: input.name,
    domain: input.domain,
    plan: input.plan,
    vectorIndex: input.vectorIndex ?? `tenant-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    settings: {
      tone: 'friendly',
      emojiUsage: 'casual',
      primaryCta: 'Contact us',
    },
  };

  return upsert<TenantRecord>(SCOPE, TABLE, tenant, tenant.id);
};

export const listTenants = () => findAll<TenantRecord>(SCOPE, TABLE);

export const getTenant = (tenantId: string) => find<TenantRecord>(SCOPE, TABLE, tenantId) ?? null;
