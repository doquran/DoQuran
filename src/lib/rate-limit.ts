import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;

function prune() {
  const now = Date.now();
  for (const [k, b] of store) {
    if (now > b.resetAt) store.delete(k);
  }
}

/** Best-effort client IP (trust your reverse proxy in production). */
export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Fixed-window counter per key. Resets when the window expires.
 * For multi-instance production deploys, replace with Redis (e.g. Upstash).
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number = WINDOW_MS
): { ok: true } | { ok: false; retryAfterSec: number } {
  if (process.env.RATE_LIMIT_DISABLED === "true") return { ok: true };

  if (store.size > 50_000) prune();

  const now = Date.now();
  const b = store.get(key);
  if (!b || now > b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function rateLimitOrResponse(
  req: Request,
  routeKey: string,
  max: number,
  windowMs?: number
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${routeKey}:${ip}`;
  const r = checkRateLimit(key, max, windowMs);
  if (r.ok) return null;
  return NextResponse.json(
    { error: "Too many requests. Try again in a few minutes." },
    {
      status: 429,
      headers: { "Retry-After": String(r.retryAfterSec) },
    }
  );
}
