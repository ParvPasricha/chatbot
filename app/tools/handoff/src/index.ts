import express from 'express';
import { createZendeskTicket } from './zendesk.client';
import { createIntercomConversation } from './intercom.client';
import { sendInboxMessage } from './inbox.client';
import { getEnv, createLogger } from '@chatbot/shared';

const app = express();
const env = getEnv();
const logger = createLogger('tools-handoff');
app.use(express.json());

app.post('/handoff', async (req, res) => {
  const { tenantId, reason, channel = 'zendesk' } = req.body;
  const result = channel === 'intercom'
    ? await createIntercomConversation(tenantId, reason)
    : channel === 'inbox'
      ? await sendInboxMessage(tenantId, { reason })
      : await createZendeskTicket(tenantId, reason);
  res.json({ handoff: result });
});

if (require.main === module) {
  const port = Number(new URL(env.TOOLS_SERVICE_URL).port || '4503');
  app.listen(port, () => logger.info(`Handoff adapter listening on ${port}`));
}

export default app;
