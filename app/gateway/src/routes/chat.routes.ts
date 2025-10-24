import { Router } from 'express';
import axios from 'axios';
import { chatRequestSchema, validate, telemetry } from '@chatbot/shared';
import { authenticate } from '../middleware/auth.middleware';
import { resolveTenant, TenantScopedRequest } from '../middleware/tenantResolver';
import { chatLimiter } from '../middleware/rateLimit.middleware';
import { ok } from '../utils/responseBuilder';
import { HttpError } from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { getEnv } from '@chatbot/shared';

const env = getEnv();

export const chatRouter = Router();

chatRouter.post('/chat', authenticate, chatLimiter, resolveTenant, async (req, res, next) => {
  try {
    const payload = validate(chatRequestSchema, {
      ...req.body,
      tenantId: (req as TenantScopedRequest).tenantId,
    });

    telemetry.track({ event: 'conversation_started', tenantId: payload.tenantId, conversationId: payload.conversationId });

    const { data } = await axios.post(`${env.ORCHESTRATOR_URL}/chat`, payload);

    telemetry.track({
      event: 'answer_generated',
      tenantId: payload.tenantId,
      conversationId: payload.conversationId,
      intent: data.intent,
      confidence: data.confidence,
    });

    return ok(res, data);
  } catch (error) {
    return next(error instanceof HttpError ? error : new HttpError(500, 'Chat orchestration failed'));
  }
});

chatRouter.get('/chat/health', (_req, res) => {
  logger.debug('Chat health check invoked');
  return ok(res, { status: 'ok' });
});
