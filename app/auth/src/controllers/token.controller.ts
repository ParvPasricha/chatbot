import { Request, Response } from 'express';
import { verifyToken } from '../services/jwt.service';

export const introspect = (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const payload = verifyToken(token);
    return res.json({ success: true, payload });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
