import pino from 'pino';
import { getEnv } from './config';

type LoggerNamespace = 'gateway' | 'auth' | 'tenants' | 'ingestion' | 'orchestrator' | 'dashboard' | 'widget' | 'tools';

const env = getEnv();

export const createLogger = (namespace: LoggerNamespace | string) =>
  pino({
    name: `chatbot-${namespace}`,
    level: env.LOG_LEVEL,
    transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  });

export const systemLogger = createLogger('platform');
