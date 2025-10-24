import { Request, Response } from 'express';
import { createUser } from '../services/tenantAuth.service';

export const signup = async (req: Request, res: Response) => {
  const { tenantId, email, password, roles } = req.body;
  const user = await createUser(tenantId, email, password, roles ?? ['owner']);
  return res.status(201).json({ success: true, user: { id: user.id, email: user.email, roles: user.roles } });
};
