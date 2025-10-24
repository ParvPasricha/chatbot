import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { startConsumers } from './queue/rabbitmq.consumer';
import { mq, createLogger, getEnv } from '@chatbot/shared';
import { randomUUID } from 'crypto';

const app = express();
const logger = createLogger('ingestion');
const env = getEnv();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

startConsumers();

app.post('/ingest/pdf', (req, res) => {
  const { tenantId, base64 } = req.body;
  mq.publish('ingestion', { id: randomUUID(), tenantId, payload: { type: 'pdf', tenantId, buffer: Buffer.from(base64, 'base64') } });
  res.status(202).json({ success: true });
});

app.post('/ingest/website', (req, res) => {
  const { tenantId, url } = req.body;
  mq.publish('ingestion', { id: randomUUID(), tenantId, payload: { type: 'website', tenantId, url } });
  res.status(202).json({ success: true });
});

if (require.main === module) {
  const port = new URL(env.INGESTION_SERVICE_URL).port || '4400';
  app.listen(Number(port), () => logger.info(`Ingestion service listening on ${port}`));
}

export default app;
