"use client";

import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Something went wrong.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="dq-card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center sm:p-9">
        <span className="text-4xl">📧</span>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed text-[var(--dq-muted)]">
          If an account exists for <strong className="text-[var(--dq-ink)]">{email}</strong>,
          we sent a password reset link. It expires in 1&nbsp;hour.
        </p>
        <Link
          href="/login"
          className="font-outfit mt-2 text-sm font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="dq-card mx-auto flex max-w-md flex-col gap-5 p-8 sm:p-9"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Forgot password
        </h1>
        <p className="mt-1 text-sm text-[var(--dq-muted)]">
          Enter your email and we&apos;ll send a reset link.
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
        {busy ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-sm text-[var(--dq-muted)]">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 hover:decoration-[var(--dq-primary)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
