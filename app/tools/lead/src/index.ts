import express from 'express';
import { createHubspotLead } from './hubspot.client';
import { createSalesforceLead } from './salesforce.client';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('tools-lead');
app.use(express.json());

app.post('/lead', async (req, res) => {
  const { tenantId, intent, system = 'hubspot', ...rest } = req.body;
  const lead = system === 'salesforce'
    ? await createSalesforceLead(tenantId, { intent, ...rest })
    : await createHubspotLead(tenantId, { intent, ...rest });
  res.json({ lead });
});

if (require.main === module) {
  const port = Number(new URL(env.TOOLS_SERVICE_URL).port || '4502');
  app.listen(port, () => logger.info(`Lead adapter listening on ${port}`));
}

export default app;
