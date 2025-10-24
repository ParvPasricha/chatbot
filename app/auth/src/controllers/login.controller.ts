import { Request, Response } from 'express';
import { signToken } from '../services/jwt.service';
import { authenticateUser } from '../services/tenantAuth.service';

export const login = async (req: Request, res: Response) => {
  const { tenantId, email, password } = req.body;
  const user = await authenticateUser(tenantId, email, password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = signToken({ id: user.id, tenantId: user.tenantId, roles: user.roles });
  return res.json({ success: true, token });
};
