import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { login } from './controllers/login.controller';
import { signup } from './controllers/signup.controller';
import { introspect } from './controllers/token.controller';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('auth');

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post('/login', login);
app.post('/signup', signup);
app.post('/introspect', introspect);

if (require.main === module) {
  const port = new URL(env.AUTH_SERVICE_URL).port || '4300';
  app.listen(Number(port), () => logger.info(`Auth service listening on ${port}`));
}

export default app;
