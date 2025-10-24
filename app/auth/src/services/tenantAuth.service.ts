import { randomUUID } from 'crypto';
import { upsert, findAll } from '@chatbot/shared';
import { hashPassword, verifyPassword } from '../utils/passwordHash';

export interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  roles: string[];
}

const TABLE = 'users';

export const createUser = async (tenantId: string, email: string, password: string, roles: string[]): Promise<UserRecord> => {
  const passwordHash = await hashPassword(password);
  const record = await upsert<UserRecord>(tenantId, TABLE, {
    id: randomUUID(),
    tenantId,
    email,
    passwordHash,
    roles,
  });
  return record;
};

export const authenticateUser = async (tenantId: string, email: string, password: string): Promise<UserRecord | null> => {
  const users = findAll<UserRecord>(tenantId, TABLE);
  const candidate = users.find((user) => user.email === email);
  if (!candidate) return null;
  const valid = await verifyPassword(password, candidate.passwordHash);
  return valid ? candidate : null;
};

export const listUsers = (tenantId: string) => findAll<UserRecord>(tenantId, TABLE);
