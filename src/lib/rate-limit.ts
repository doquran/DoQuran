import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash Redis rate limiter (production) with in-memory fallback (local dev)
// ---------------------------------------------------------------------------

type Bucket = { count: number; resetAt: number };
const memStore = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60 * 1000;

function getUpstashLimiter(
  max: number,
  windowSec: number,
): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
    prefix: "dq_rl",
    analytics: true,
  });
}

/** Best-effort client IP (trust your reverse proxy in production). */
export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** In-memory fallback for local dev without Redis. */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number = WINDOW_MS,
): { ok: true } | { ok: false; retryAfterSec: number } {
  if (process.env.RATE_LIMIT_DISABLED === "true") return { ok: true };

  if (memStore.size > 50_000) {
    const now = Date.now();
    for (const [k, b] of memStore) {
      if (now > b.resetAt) memStore.delete(k);
    }
  }

  const now = Date.now();
  const b = memStore.get(key);
  if (!b || now > b.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

/**
 * Rate-limit a request. Uses Upstash Redis when configured, falls back to
 * in-memory for local dev.
 */
export async function rateLimitOrResponseAsync(
  req: Request,
  routeKey: string,
  max: number,
  windowSec: number = 900,
): Promise<NextResponse | null> {
  if (process.env.RATE_LIMIT_DISABLED === "true") return null;

  const ip = getClientIp(req);
  const identifier = `${routeKey}:${ip}`;

  const upstash = getUpstashLimiter(max, windowSec);
  if (upstash) {
    const { success, reset } = await upstash.limit(identifier);
    if (success) return null;
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  // Fallback to in-memory
  const r = checkRateLimit(identifier, max, windowSec * 1000);
  if (r.ok) return null;
  return NextResponse.json(
    { error: "Too many requests. Try again in a few minutes." },
    { status: 429, headers: { "Retry-After": String(r.retryAfterSec) } },
  );
}

/**
 * Synchronous convenience wrapper — uses in-memory only.
 * Kept for backward compatibility; prefer rateLimitOrResponseAsync for new code.
 */
export function rateLimitOrResponse(
  req: Request,
  routeKey: string,
  max: number,
  windowMs?: number,
): NextResponse | null {
  if (process.env.RATE_LIMIT_DISABLED === "true") return null;
  const ip = getClientIp(req);
  const key = `${routeKey}:${ip}`;
  const r = checkRateLimit(key, max, windowMs);
  if (r.ok) return null;
  return NextResponse.json(
    { error: "Too many requests. Try again in a few minutes." },
    { status: 429, headers: { "Retry-After": String(r.retryAfterSec) } },
  );
}
