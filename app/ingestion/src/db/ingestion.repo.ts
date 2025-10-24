import { upsert, findAll } from '@chatbot/shared';

export interface KnowledgeChunk {
  id: string;
  tenantId: string;
  text: string;
  source: string;
}

const TABLE = 'knowledge-chunks';

export const storeChunk = (tenantId: string, chunk: KnowledgeChunk) =>
  upsert<KnowledgeChunk>(tenantId, TABLE, chunk, chunk.id);

export const listChunks = (tenantId: string) => findAll<KnowledgeChunk>(tenantId, TABLE);
