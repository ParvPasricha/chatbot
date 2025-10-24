import { randomUUID } from 'crypto';
import { systemLogger } from './logger';

type RecordValue<T> = T & { id: string; createdAt: string; updatedAt: string };

type TableMap = Map<string, Map<string, RecordValue<any>>>;

const tables: TableMap = new Map();

const logger = systemLogger.child({ module: 'inMemoryDb' });

const nowIso = () => new Date().toISOString();

export const upsert = <T extends object>(tenantId: string, table: string, payload: T, id?: string): RecordValue<T> => {
  const tenantTableKey = `${tenantId}:${table}`;
  if (!tables.has(tenantTableKey)) {
    tables.set(tenantTableKey, new Map());
  }

  const entityId = id ?? randomUUID();
  const existing = tables.get(tenantTableKey)!.get(entityId);
  const record: RecordValue<T> = {
    id: entityId,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    ...(payload as T),
  };

  tables.get(tenantTableKey)!.set(entityId, record);
  logger.debug({ tenantId, table, entityId }, 'entity upserted');
  return record;
};

export const find = <T>(tenantId: string, table: string, entityId: string): RecordValue<T> | undefined => {
  const record = tables.get(`${tenantId}:${table}`)?.get(entityId);
  logger.debug({ tenantId, table, entityId, hit: Boolean(record) }, 'lookup');
  return record;
};

export const findAll = <T>(tenantId: string, table: string): RecordValue<T>[] => {
  const list = Array.from(tables.get(`${tenantId}:${table}`)?.values() ?? []);
  logger.debug({ tenantId, table, count: list.length }, 'list');
  return list;
};

export const remove = (tenantId: string, table: string, entityId: string): boolean => {
  const deleted = tables.get(`${tenantId}:${table}`)?.delete(entityId) ?? false;
  logger.debug({ tenantId, table, entityId, deleted }, 'remove');
  return deleted;
};

export const reset = () => {
  tables.clear();
};
