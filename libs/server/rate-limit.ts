import { config } from '@/libs/config';
import { ToronetError } from '@/libs/toronet/errors';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function enforceRateLimit(request: Request, scope: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0];
  const ip = forwardedFor?.trim() || 'local';
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + config.toroRateLimitWindowMs,
    });
    return;
  }

  if (current.count >= config.toroRateLimitMax) {
    throw new ToronetError({
      kind: 'rate_limited',
      status: 429,
      message: 'Too many requests. Please slow down and try again shortly.',
    });
  }

  current.count += 1;
}
