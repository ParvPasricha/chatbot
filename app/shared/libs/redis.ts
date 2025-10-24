const cache = new Map<string, { value: unknown; expiresAt?: number }>();

export const setCache = (key: string, value: unknown, ttlSeconds?: number) => {
  cache.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
};

export const getCache = <T>(key: string): T | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
};

export const deleteCache = (key: string) => cache.delete(key);

export const resetCache = () => cache.clear();
