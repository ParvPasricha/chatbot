import { Router } from 'express';
import { ok } from '../utils/responseBuilder';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => ok(res, { status: 'ok' }));
