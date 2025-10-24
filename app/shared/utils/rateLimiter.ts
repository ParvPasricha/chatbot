const buckets = new Map<string, { tokens: number; updatedAt: number }>();

export const rateLimiter = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.updatedAt > windowMs) {
    buckets.set(key, { tokens: limit - 1, updatedAt: now });
    return true;
  }

  if (bucket.tokens <= 0) {
    return false;
  }

  bucket.tokens -= 1;
  bucket.updatedAt = now;
  buckets.set(key, bucket);
  return true;
};

export const resetRateLimiter = () => buckets.clear();
