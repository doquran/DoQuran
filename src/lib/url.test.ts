import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { baseUrl } from "./url";

describe("baseUrl", () => {
  const envBackup: Record<string, string | undefined> = {};

  beforeEach(() => {
    envBackup.NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    envBackup.VERCEL_URL = process.env.VERCEL_URL;
    envBackup.PORT = process.env.PORT;
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.VERCEL_URL;
    delete process.env.PORT;
  });

  afterEach(() => {
    for (const [k, v] of Object.entries(envBackup)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("prefers NEXT_PUBLIC_BASE_URL", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://doquran.app";
    process.env.VERCEL_URL = "doquran.vercel.app";
    expect(baseUrl()).toBe("https://doquran.app");
  });

  it("falls back to VERCEL_URL", () => {
    process.env.VERCEL_URL = "doquran-abc.vercel.app";
    expect(baseUrl()).toBe("https://doquran-abc.vercel.app");
  });

  it("falls back to localhost", () => {
    expect(baseUrl()).toBe("http://localhost:3000");
  });

  it("uses PORT env var for localhost", () => {
    process.env.PORT = "4000";
    expect(baseUrl()).toBe("http://localhost:4000");
  });
});
