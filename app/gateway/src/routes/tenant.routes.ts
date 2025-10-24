import { Router } from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.middleware';
import { ok } from '../utils/responseBuilder';
import { HttpError } from '../utils/errorHandler';
import { getEnv } from '@chatbot/shared';

const env = getEnv();

export const tenantRouter = Router();

tenantRouter.get('/tenants', authenticate, async (_req, res, next) => {
  try {
    const { data } = await axios.get(`${env.TENANT_SERVICE_URL}/tenants`);
    return ok(res, data.tenants ?? []);
  } catch (error) {
    return next(new HttpError(502, 'Tenant service unavailable'));
  }
});

tenantRouter.get('/tenants/:id', authenticate, async (req, res, next) => {
  try {
    const { data } = await axios.get(`${env.TENANT_SERVICE_URL}/tenants/${req.params.id}`);
    return ok(res, data.tenant);
  } catch (error) {
    return next(new HttpError(404, 'Tenant not found'));
  }
});

tenantRouter.post('/tenants', authenticate, async (req, res, next) => {
  try {
    const { data } = await axios.post(`${env.TENANT_SERVICE_URL}/tenants`, req.body);
    return ok(res, data.tenant, 201);
  } catch (error) {
    return next(new HttpError(400, 'Failed to create tenant'));
  }
});

tenantRouter.get('/internal/tenants/:id', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${env.TENANT_SERVICE_URL}/tenants/${req.params.id}`);
    return ok(res, data.tenant);
  } catch (error) {
    return next(new HttpError(404, 'Tenant not found'));
  }
});
