import { NextFunction, Response } from 'express';
import axios from 'axios';
import { TENANT_HEADER, getEnv } from '@chatbot/shared';
import { AuthenticatedRequest } from './auth.middleware';
import { HttpError } from '../utils/errorHandler';

const env = getEnv();

export interface TenantScopedRequest extends AuthenticatedRequest {
  tenantId?: string;
  tenant?: unknown;
}

export const resolveTenant = async (req: TenantScopedRequest, _res: Response, next: NextFunction) => {
  const explicitTenant = req.headers[TENANT_HEADER] as string | undefined;
  const tenantId = explicitTenant ?? req.user?.tenantId;
  if (!tenantId) {
    return next(new HttpError(400, 'Tenant context missing'));
  }

  try {
    const { data } = await axios.get(`${env.TENANT_SERVICE_URL}/tenants/${tenantId}`);
    req.tenantId = tenantId;
    req.tenant = data.tenant ?? data;
    return next();
  } catch (error) {
    return next(new HttpError(404, 'Tenant not found'));
  }
};
