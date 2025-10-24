import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.string().default('info'),
  JWT_SECRET: z.string().min(10).default('change-me'),
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgres://')).default('postgres://localhost:5432/chatbot'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://localhost'),
  OPENAI_API_KEY: z.string().optional(),
  PINECONE_API_KEY: z.string().optional(),
  WEAVIATE_URL: z.string().optional(),
  WEAVIATE_API_KEY: z.string().optional(),
  S3_BUCKET: z.string().default('kb'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GATEWAY_URL: z.string().url().default('http://localhost:4000'),
  ORCHESTRATOR_URL: z.string().url().default('http://localhost:4100'),
  TENANT_SERVICE_URL: z.string().url().default('http://localhost:4200'),
  AUTH_SERVICE_URL: z.string().url().default('http://localhost:4300'),
  INGESTION_SERVICE_URL: z.string().url().default('http://localhost:4400'),
  TOOLS_SERVICE_URL: z.string().url().default('http://localhost:4500')
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }
  return cachedEnv;
};
