import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { TENANT_HEADER, REQUEST_ID_HEADER, getEnv } from '@chatbot/shared';
import { chatRouter } from './routes/chat.routes';
import { tenantRouter } from './routes/tenant.routes';
import { healthRouter } from './routes/health.routes';
import { errorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';
import { v4 as uuid } from 'uuid';

const app = express();
const env = getEnv();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use((req, _res, next) => {
  req.headers[REQUEST_ID_HEADER] = req.headers[REQUEST_ID_HEADER] ?? uuid();
  if (req.headers[TENANT_HEADER]) {
    logger.debug({ tenantId: req.headers[TENANT_HEADER] }, 'incoming tenant request');
  }
  next();
});

app.use('/api', chatRouter);
app.use('/api', tenantRouter);
app.use('/api', healthRouter);

app.use(errorHandler);

if (require.main === module) {
  const port = env.PORT;
  app.listen(port, () => logger.info(`Gateway listening on ${port}`));
}

export default app;
