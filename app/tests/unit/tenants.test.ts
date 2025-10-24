import assert from 'assert';
import { createTenant } from '../../tenants/src/services/tenant.service';

const tenant = createTenant({ name: 'Demo', domain: 'demo.com', plan: 'starter' });
assert.strictEqual(tenant.name, 'Demo');
console.log('tenant creation test passed');
