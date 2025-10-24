import axios from 'axios';
import { cleanHtml } from '../utils/htmlCleaner';
import { chunkText } from '../utils/textChunker';
import { embedChunks } from '../utils/embedClient';
import { storeChunk } from '../db/ingestion.repo';
import { randomUUID } from 'crypto';

export const scrapeWebsite = async (tenantId: string, url: string) => {
  const { data } = await axios.get<string>(url);
  const cleaned = cleanHtml(data);
  const chunks = chunkText(cleaned);
  const embeddings = await embedChunks({ tenantId, chunks });
  embeddings.forEach((embedding, index) => {
    storeChunk(tenantId, {
      id: randomUUID(),
      tenantId,
      text: embedding.text,
      source: `web#${index}`,
    });
  });
};
