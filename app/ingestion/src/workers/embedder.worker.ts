import { embedChunks } from '../utils/embedClient';
import { storeChunk } from '../db/ingestion.repo';
import { randomUUID } from 'crypto';

export const createEmbeddings = async (tenantId: string, chunks: string[]) => {
  const embeddings = await embedChunks({ tenantId, chunks });
  embeddings.forEach((embedding, index) => {
    storeChunk(tenantId, {
      id: randomUUID(),
      tenantId,
      text: embedding.text,
      source: `embed#${index}`,
    });
  });
};
