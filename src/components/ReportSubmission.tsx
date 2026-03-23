"use client";

import { useState } from "react";

type Props = { submissionId: string };

export function ReportSubmission({ submissionId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.status === 401) {
        setError("Sign in to report.");
        setBusy(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: unknown;
        };
        setError(
          typeof data.error === "string" ? data.error : "Could not send report."
        );
        setBusy(false);
        return;
      }
      setDone(true);
      setOpen(false);
      setReason("");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="text-center text-xs text-[var(--dq-muted)]">
        Thanks — your report was received.
      </p>
    );
  }

  return (
    <div className="text-center">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs font-medium tracking-wide text-[var(--dq-muted)] underline decoration-[var(--dq-border)] underline-offset-2 transition hover:text-[var(--dq-ink)]"
        >
          Report this post
        </button>
      ) : (
        <form
          onSubmit={(e) => void submit(e)}
          className="mx-auto mt-2 max-w-md text-left"
        >
          <label
            htmlFor="report-reason"
            className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-gold-muted)]"
          >
            Reason
          </label>
          <textarea
            id="report-reason"
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="dq-input mb-3 min-h-[4.5rem] resize-y text-sm"
            placeholder="Briefly describe the issue…"
          />
          {error ? (
            <p className="mb-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-[var(--dq-primary)] px-4 py-2 text-xs font-semibold text-[color-mix(in_srgb,white_95%,var(--dq-gold))] disabled:opacity-50"
            >
              {busy ? "Sending…" : "Submit report"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="rounded-full border border-[var(--dq-border)] px-4 py-2 text-xs font-semibold text-[var(--dq-ink)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
