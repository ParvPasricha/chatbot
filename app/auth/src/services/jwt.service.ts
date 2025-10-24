import jwt from 'jsonwebtoken';
import { getEnv } from '@chatbot/shared';

const env = getEnv();

export interface TokenPayload {
  id: string;
  tenantId: string;
  roles: string[];
}

export const signToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.NODE_ENV === 'development' ? '12h' : '1h' });

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as TokenPayload;
