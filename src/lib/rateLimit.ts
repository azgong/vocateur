import { NextRequest } from "next/server";

// In-memory, per-instance rate limiter. Vercel's fluid compute reuses warm
// instances heavily at this traffic scale, so this meaningfully throttles a
// script hammering an endpoint even though it doesn't coordinate across
// concurrent instances or survive a cold start. Good enough for a beta-stage
// site; revisit with a shared store (e.g. Upstash) if abuse gets serious.
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Returns true if the request should be allowed, false if it's over the limit. */
export function rateLimit(req: NextRequest, routeKey: string, limit: number, windowMs: number): boolean {
  const key = `${routeKey}:${clientIp(req)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}
