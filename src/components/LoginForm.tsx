"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setBusy(false);
        return;
      }
      router.push(nextUrl.startsWith("/") ? nextUrl : "/");
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="dq-card mx-auto flex max-w-md flex-col gap-5 p-8 sm:p-9"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-[var(--dq-muted)]">
          Welcome back to DoQuran.
        </p>
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="dq-input"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dq-input"
        />
      </div>
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
        >
          Forgot password?
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-[var(--dq-primary)] py-3.5 text-sm font-semibold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition duration-200 hover:brightness-110 disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-[var(--dq-muted)]">
        No account?{" "}
        <Link
          href={
            nextUrl !== "/"
              ? `/register?next=${encodeURIComponent(nextUrl)}`
              : "/register"
          }
          className="font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 hover:decoration-[var(--dq-primary)]"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
