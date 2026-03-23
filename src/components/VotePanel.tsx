"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { dispatchLevelUp } from "@/components/LevelUpToast";

type Props = {
  submissionId: string;
  initialScore: number;
  initialMyVote: number | null;
  /** When set, voting controls are disabled (e.g. author viewing own post). */
  voteDisabledReason?: string | null;
  /** Seal slugs + labels on this submission, used for level-up toasts. */
  badgeMeta?: { slug: string; label: string }[];
};

export function VotePanel({
  submissionId,
  initialScore,
  initialMyVote,
  voteDisabledReason,
  badgeMeta = [],
}: Props) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore);
  const [myVote, setMyVote] = useState<number | null>(initialMyVote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(value: 1 | -1) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (res.status === 401) {
        setError("Sign in to vote.");
        setBusy(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: unknown;
        };
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Could not record vote.";
        setError(msg);
        setBusy(false);
        return;
      }
      const data = (await res.json()) as {
        score: number;
        myVote: number | null;
        levelChanges?: { sealSlug: string; newLevel: number }[];
      };
      setScore(data.score);
      setMyVote(data.myVote);

      if (data.levelChanges) {
        for (const lc of data.levelChanges) {
          const meta = badgeMeta.find((b) => b.slug === lc.sealSlug);
          dispatchLevelUp({
            sealSlug: lc.sealSlug,
            sealLabel: meta?.label ?? lc.sealSlug,
            newLevel: lc.newLevel,
          });
        }
      }

      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  const locked = Boolean(voteDisabledReason);

  return (
    <div className="flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_82%,var(--dq-gold)_18%)] bg-[var(--dq-surface)] px-1.5 py-2.5 shadow-[var(--dq-shadow-md)] sm:sticky sm:top-28">
      {locked ? (
        <p className="max-w-[9rem] px-1 pb-1 text-center text-[0.65rem] leading-snug text-[var(--dq-muted)]">
          {voteDisabledReason}
        </p>
      ) : null}
      <button
        type="button"
        disabled={busy || locked}
        aria-pressed={myVote === 1}
        onClick={() => void send(1)}
        className="flex h-10 w-11 items-center justify-center rounded-lg text-[var(--dq-primary)] transition hover:bg-[var(--dq-muted-bg)] disabled:opacity-45 aria-pressed:bg-[color-mix(in_srgb,var(--dq-primary)_14%,var(--dq-surface-muted))] aria-pressed:ring-1 aria-pressed:ring-[color-mix(in_srgb,var(--dq-primary)_35%,transparent)]"
        title="Upvote"
      >
        <span className="text-lg leading-none" aria-hidden>
          ▲
        </span>
      </button>
      <span
        className="min-w-[2.5rem] py-1 text-center text-sm font-bold tabular-nums text-[var(--dq-ink)]"
        aria-live="polite"
      >
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        type="button"
        disabled={busy || locked}
        aria-pressed={myVote === -1}
        onClick={() => void send(-1)}
        className="flex h-10 w-11 items-center justify-center rounded-lg text-[var(--dq-accent)] transition hover:bg-[var(--dq-muted-bg)] disabled:opacity-45 aria-pressed:bg-[color-mix(in_srgb,var(--dq-accent)_12%,var(--dq-surface-muted))] aria-pressed:ring-1 aria-pressed:ring-[color-mix(in_srgb,var(--dq-accent)_30%,transparent)]"
        title="Downvote"
      >
        <span className="text-lg leading-none" aria-hidden>
          ▼
        </span>
      </button>
      {error ? (
        <p className="max-w-[7rem] px-1 text-center text-[0.7rem] leading-snug text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
