import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { processConversation } from './engine/conversationManager';
import { createLogger, getEnv } from '@chatbot/shared';

const app = express();
const logger = createLogger('orchestrator');
const env = getEnv();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { tenantId, message, businessProfile, brand, integrations, history = [] } = req.body;
  const response = await processConversation({
    tenantId,
    message,
    businessProfile: businessProfile ?? {},
    brand: brand ?? {},
    integrations: integrations ?? {},
    history,
  });
  res.json(response);
});

if (require.main === module) {
  const port = new URL(env.ORCHESTRATOR_URL).port || '4100';
  app.listen(Number(port), () => logger.info(`Orchestrator listening on ${port}`));
}

export default app;
