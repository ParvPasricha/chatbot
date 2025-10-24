import { parsePdf } from '../utils/pdfParser';
import { chunkText } from '../utils/textChunker';
import { embedChunks } from '../utils/embedClient';
import { storeChunk } from '../db/ingestion.repo';
import { randomUUID } from 'crypto';

export const ingestPdf = async (tenantId: string, buffer: Buffer) => {
  const text = await parsePdf(buffer);
  const chunks = chunkText(text);
  const embeddings = await embedChunks({ tenantId, chunks });
  embeddings.forEach((embedding, index) => {
    storeChunk(tenantId, {
      id: randomUUID(),
      tenantId,
      text: embedding.text,
      source: `pdf#${index}`,
    });
  });
};
