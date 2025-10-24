import { Request, Response } from 'express';
import { createTenant, listTenants, getTenant } from '../services/tenant.service';

export const createTenantHandler = (req: Request, res: Response) => {
  const tenant = createTenant(req.body);
  return res.status(201).json({ success: true, tenant });
};

export const listTenantHandler = (_req: Request, res: Response) => {
  const tenants = listTenants();
  return res.json({ success: true, tenants });
};

export const getTenantHandler = (req: Request, res: Response) => {
  const tenant = getTenant(req.params.id);
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant not found' });
  }
  return res.json({ success: true, tenant });
};
