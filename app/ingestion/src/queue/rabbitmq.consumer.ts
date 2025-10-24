import { mq, QueueMessage } from '@chatbot/shared';
import { ingestPdf } from '../workers/pdf.worker';
import { scrapeWebsite } from '../workers/webScraper.worker';
import { createEmbeddings } from '../workers/embedder.worker';

type IngestionPayload =
  | { type: 'pdf'; tenantId: string; buffer: Buffer }
  | { type: 'website'; tenantId: string; url: string }
  | { type: 'embed'; tenantId: string; chunks: string[] };

export const startConsumers = () => {
  mq.consume<IngestionPayload>('ingestion', async (message: QueueMessage<IngestionPayload>) => {
    switch (message.payload.type) {
      case 'pdf':
        await ingestPdf(message.payload.tenantId, message.payload.buffer);
        break;
      case 'website':
        await scrapeWebsite(message.payload.tenantId, message.payload.url);
        break;
      case 'embed':
        await createEmbeddings(message.payload.tenantId, message.payload.chunks);
        break;
      default:
        break;
    }
  });
};
