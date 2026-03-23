import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

function setRateLimitDisabled(value: string | undefined) {
  if (value === undefined) delete process.env.RATE_LIMIT_DISABLED;
  else process.env.RATE_LIMIT_DISABLED = value;
}

describe("checkRateLimit (in-memory fallback)", () => {
  it("allows requests under the cap", () => {
    const prev = process.env.RATE_LIMIT_DISABLED;
    setRateLimitDisabled("false");
    const key = `t-${crypto.randomUUID()}`;
    expect(checkRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(checkRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(checkRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(checkRateLimit(key, 3, 60_000).ok).toBe(false);
    setRateLimitDisabled(prev);
  });

  it("is bypassed when RATE_LIMIT_DISABLED is true", () => {
    const prev = process.env.RATE_LIMIT_DISABLED;
    setRateLimitDisabled("true");
    const key = `b-${crypto.randomUUID()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 1, 60_000).ok).toBe(true);
    }
    setRateLimitDisabled(prev);
  });
});
