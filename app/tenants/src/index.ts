import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createTenantHandler, listTenantHandler, getTenantHandler } from './controllers/tenant.controller';
import { billingSummaryHandler } from './controllers/billing.controller';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('tenants');

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/tenants', listTenantHandler);
app.get('/tenants/:id', getTenantHandler);
app.post('/tenants', createTenantHandler);
app.post('/billing/summary', billingSummaryHandler);

if (require.main === module) {
  const port = new URL(env.TENANT_SERVICE_URL).port || '4200';
  app.listen(Number(port), () => logger.info(`Tenant service listening on ${port}`));
}

export default app;
