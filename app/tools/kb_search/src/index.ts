import express from 'express';
import { queryPinecone } from './pinecone.client';
import { queryWeaviate } from './weaviate.client';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('tools-kb');

app.use(express.json());

app.post('/kb-search', async (req, res) => {
  const { tenantId, query, topK = 6 } = req.body;
  const weaviateResults = await queryWeaviate(tenantId, query);
  const pineconeResults = await queryPinecone(tenantId, query);
  const results = [...weaviateResults, ...pineconeResults].slice(0, topK);
  res.json({ results });
});

if (require.main === module) {
  const port = Number(new URL(env.TOOLS_SERVICE_URL).port || '4500');
  app.listen(port, () => logger.info(`KB search tool listening on ${port}`));
}

export default app;
