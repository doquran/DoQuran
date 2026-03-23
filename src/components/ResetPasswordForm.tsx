"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="dq-card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center sm:p-9">
        <span className="text-4xl">✕</span>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Invalid link
        </h1>
        <p className="text-sm text-[var(--dq-muted)]">
          This password reset link is missing a token. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="font-outfit mt-2 text-sm font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="dq-card mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center sm:p-9">
        <span className="text-4xl">✓</span>
        <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Password updated
        </h1>
        <p className="text-sm text-[var(--dq-muted)]">
          Your password has been changed. You can now sign in.
        </p>
        <Link
          href="/login"
          className="font-outfit mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-7 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition hover:brightness-110"
        >
          Sign in
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: unknown };
        setError(
          typeof d.error === "string"
            ? d.error
            : "Reset failed. The link may have expired.",
        );
        setBusy(false);
        return;
      }
      setDone(true);
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
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-[var(--dq-muted)]">
          Choose a strong password — at least 8 characters.
        </p>
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dq-input"
        />
      </div>
      <div>
        <label
          htmlFor="confirm"
          className="mb-1.5 block text-sm font-medium text-[var(--dq-ink)]"
        >
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {busy ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}
