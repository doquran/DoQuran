"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: unknown };
        setError(
          typeof d.error === "string" ? d.error : "Could not change password.",
        );
        setBusy(false);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <label className="block">
        <span className="font-outfit text-sm font-semibold tracking-wide text-[var(--dq-ink)]">
          Current password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="dq-input mt-1.5"
        />
      </label>

      <label className="block">
        <span className="font-outfit text-sm font-semibold tracking-wide text-[var(--dq-ink)]">
          New password
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="dq-input mt-1.5"
        />
        <span className="mt-1 block text-[0.7rem] text-[var(--dq-muted)]">
          At least 8 characters
        </span>
      </label>

      <label className="block">
        <span className="font-outfit text-sm font-semibold tracking-wide text-[var(--dq-ink)]">
          Confirm new password
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="dq-input mt-1.5"
        />
      </label>

      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="font-outfit rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-6 py-3 text-sm font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)] disabled:opacity-50"
      >
        {busy ? "Changing…" : success ? "Password changed!" : "Change password"}
      </button>
    </form>
  );
}
