"use client";

import { useState } from "react";

export function ResendVerificationButton() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Could not send email.");
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
      <p className="text-sm font-medium text-green-700 dark:text-green-400">
        Verification email sent — check your inbox.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void resend()}
        className="font-outfit rounded-full border border-amber-300 bg-amber-100 px-5 py-2 text-xs font-bold tracking-wide text-amber-900 shadow-sm transition hover:bg-amber-200 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-900/60 dark:text-amber-100 dark:hover:bg-amber-900/80"
      >
        {busy ? "Sending…" : "Resend verification email"}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-red-700 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
