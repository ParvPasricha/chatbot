import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '@chatbot/shared';
import { HttpError } from '../utils/errorHandler';

const env = getEnv();

export interface AuthenticatedRequest extends Request {
  user?: { id: string; tenantId: string; roles: string[] };
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }
  try {
    const token = header.slice('Bearer '.length);
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest['user'];
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new HttpError(401, 'Invalid token'));
  }
};
