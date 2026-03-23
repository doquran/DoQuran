"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function destroy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: unknown;
        };
        setError(
          typeof data.error === "string" ? data.error : "Could not delete account."
        );
        setBusy(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[var(--dq-radius-lg)] border border-red-200/90 bg-red-50/50 p-5 dark:border-red-900/60 dark:bg-red-950/25">
      <h2 className="font-display text-lg font-semibold text-red-950 dark:text-red-100">
        Delete account
      </h2>
      <p className="mt-2 text-sm text-red-900/85 dark:text-red-100/80">
        Permanently removes your profile, posts, votes, and reports. This cannot
        be undone.
      </p>
      {!confirmOpen ? (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="mt-4 rounded-full border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-900 shadow-sm dark:border-red-800 dark:bg-red-950/40 dark:text-red-100"
        >
          I want to delete my account
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <label htmlFor="del-pw" className="block text-xs font-medium text-red-950 dark:text-red-100">
            Confirm with your password
          </label>
          <input
            id="del-pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dq-input max-w-sm"
          />
          {error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !password}
              onClick={() => void destroy()}
              className="rounded-full bg-red-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-red-600"
            >
              {busy ? "Deleting…" : "Delete forever"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirmOpen(false);
                setPassword("");
                setError(null);
              }}
              className="rounded-full border border-[var(--dq-border)] px-5 py-2 text-sm font-semibold text-[var(--dq-ink)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
