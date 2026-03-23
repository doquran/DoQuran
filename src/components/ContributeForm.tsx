"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MAX_BADGES_PER_SUBMISSION,
  PERSPECTIVE_BADGES,
  perspectiveBadgeClasses,
} from "@/lib/badges";
import {
  MAX_VERSES_PER_CONTRIBUTION,
  tryParseVerseRefs,
} from "@/lib/verse-parse";
import { VersePicker, type VerseRef } from "@/components/VersePicker";

const labelClass =
  "mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-gold-muted)]";

type PreviewVerse = {
  surah: number;
  ayah: number;
  surahName: string;
  arabic: string;
  english: string;
};

const DEFAULT_VERSES: VerseRef[] = [{ surah: 2, ayah: 255 }];

export function ContributeForm({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [verseList, setVerseList] = useState<VerseRef[]>(DEFAULT_VERSES);
  const [reflection, setReflection] = useState("");
  const [badgeSlugs, setBadgeSlugs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);

  const [previewVerses, setPreviewVerses] = useState<PreviewVerse[] | null>(
    null
  );
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const previewRequestId = useRef(0);

  const versesRaw = useMemo(
    () => verseList.map((v) => `${v.surah}:${v.ayah}`).join("\n"),
    [verseList]
  );

  const parsed = tryParseVerseRefs(versesRaw);

  useEffect(() => {
    const ac = new AbortController();
    const id = ++previewRequestId.current;
    const trimmed = versesRaw.trim();

    if (!trimmed) {
      const t = window.setTimeout(() => {
        setPreviewVerses(null);
        setPreviewError(null);
        setPreviewLoading(false);
      }, 0);
      return () => {
        clearTimeout(t);
        ac.abort();
      };
    }

    const local = tryParseVerseRefs(versesRaw);
    if (!local.ok) {
      const t = window.setTimeout(() => {
        setPreviewVerses(null);
        setPreviewError(local.error);
        setPreviewLoading(false);
      }, 0);
      return () => {
        clearTimeout(t);
        ac.abort();
      };
    }

    const resetT = window.setTimeout(() => {
      setPreviewError(null);
      setPreviewVerses(null);
      setPreviewLoading(true);
    }, 0);

    const timer = window.setTimeout(() => {
      void fetch("/api/quran/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versesRaw }),
        signal: ac.signal,
      })
        .then(async (res) => {
          if (id !== previewRequestId.current) return;
          const data = (await res.json()) as {
            error?: string;
            verses?: PreviewVerse[];
          };
          if (!res.ok) {
            throw new Error(data.error ?? "Could not load verses.");
          }
          if (!data.verses) throw new Error("Invalid preview response.");
          setPreviewVerses(data.verses);
        })
        .catch((e: unknown) => {
          if (e instanceof Error && e.name === "AbortError") return;
          if (id !== previewRequestId.current) return;
          setPreviewVerses(null);
          setPreviewError(
            e instanceof Error ? e.message : "Could not load verses."
          );
        })
        .finally(() => {
          if (id === previewRequestId.current) setPreviewLoading(false);
        });
    }, 450);

    return () => {
      clearTimeout(resetT);
      clearTimeout(timer);
      ac.abort();
    };
  }, [versesRaw]);

  function applyPastedVerses() {
    const r = tryParseVerseRefs(pasteText);
    if (!r.ok) {
      setPasteError(r.error);
      return;
    }
    setPasteError(null);
    setVerseList(r.refs);
  }

  function onPasteDetailsToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    const el = e.currentTarget;
    if (el.open) {
      setPasteText(versesRaw);
      setPasteError(null);
    }
  }

  function toggleBadgeSlug(slug: string) {
    setBadgeSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_BADGES_PER_SUBMISSION) return prev;
      return [...prev, slug];
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (verseList.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versesRaw,
          reflection,
          badgeSlugs: badgeSlugs.length ? badgeSlugs : undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: unknown;
        submission?: { id: string };
      };
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Could not save. Check your input.";
        setError(msg);
        setBusy(false);
        return;
      }
      if (data.submission?.id) {
        router.push(`/submissions/${data.submission.id}`);
        router.refresh();
      }
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  const canSubmit = verseList.length > 0 && parsed.ok;

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="dq-card mx-auto flex max-w-2xl flex-col gap-8 p-7 sm:p-10"
    >
      <div>
        <span className={labelClass}>Verse references</span>
        <p className="mb-3 text-xs text-[var(--dq-muted)]">
          Surah + āyah, then <strong>Add</strong>. Up to{" "}
          {MAX_VERSES_PER_CONTRIBUTION} verses.
        </p>
        <VersePicker
          verses={verseList}
          onVersesChange={setVerseList}
          maxVerses={MAX_VERSES_PER_CONTRIBUTION}
        />

        <details
          className="mt-5 overflow-hidden rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[color-mix(in_srgb,var(--dq-surface-muted)_45%,transparent)]"
          onToggle={onPasteDetailsToggle}
        >
          <summary className="cursor-pointer list-none px-5 py-3.5 text-sm font-semibold tracking-wide text-[var(--dq-primary)] transition hover:bg-[var(--dq-muted-bg)]/40 [&::-webkit-details-marker]:hidden">
            Paste or type references instead
          </summary>
          <div className="space-y-3 border-t border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] px-5 py-4">
            <textarea
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                setPasteError(null);
              }}
              rows={4}
              placeholder={"2:255\n2:256, 3:1"}
              className="dq-input min-h-[5.5rem] resize-y font-mono text-[0.8125rem]"
              aria-label="Paste verse references"
            />
            {pasteError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {pasteError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={applyPastedVerses}
              className="rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-5 py-2.5 text-sm font-semibold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_12%,transparent)] transition hover:bg-[var(--dq-muted-bg)]"
            >
              Apply to list
            </button>
          </div>
        </details>
      </div>

      <section
        className="rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-gold)_24%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_3.5%,var(--dq-surface))] p-5 sm:p-7"
        aria-live="polite"
      >
        <h2 className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--dq-gold-muted)]">
          Verse text (API)
        </h2>
        <p className="mb-5 text-xs text-[var(--dq-muted)]">
          Arabic and English (Sahih International).
        </p>

        {!versesRaw.trim() ? (
          <p className="text-sm text-[var(--dq-muted)]">
            Add at least one verse above to load the text.
          </p>
        ) : previewLoading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg bg-[var(--dq-muted-bg)]" />
            <div className="h-12 animate-pulse rounded-lg bg-[var(--dq-muted-bg)]/70" />
          </div>
        ) : previewError ? (
          <p className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            {previewError}
          </p>
        ) : previewVerses && previewVerses.length > 0 ? (
          <div className="flex flex-col gap-6">
            {previewVerses.map((v) => (
              <article
                key={`${v.surah}-${v.ayah}`}
                className="border-b border-[var(--dq-border)] pb-6 last:border-b-0 last:pb-0"
              >
                <p className="mb-2 text-xs font-medium text-[var(--dq-muted)]">
                  Surah {v.surah} · {v.surahName} · Āyah {v.ayah}
                </p>
                <p className="font-quran mb-3 text-[var(--dq-ink)]">{v.arabic}</p>
                <p className="text-sm leading-relaxed text-[var(--dq-ink)]">
                  {v.english}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <div>
        <span className={labelClass}>Perspective seals (optional)</span>
        <p className="mb-3 text-xs leading-relaxed text-[var(--dq-muted)]">
          Tag the lens you are writing from—so readers know if this is a
          scientist&apos;s, engineer&apos;s, physician&apos;s, or scholar&apos;s
          angle beside classical tafsīr. Choose up to {MAX_BADGES_PER_SUBMISSION}.
        </p>
        <div
          className="flex flex-wrap gap-2.5"
          role="group"
          aria-label="Perspective seals"
        >
          {PERSPECTIVE_BADGES.map((b) => {
            const on = badgeSlugs.includes(b.slug);
            return (
              <button
                key={b.slug}
                type="button"
                aria-pressed={on}
                title={b.tagline}
                onClick={() => toggleBadgeSlug(b.slug)}
                className={
                  on
                    ? `${perspectiveBadgeClasses(b.variant)} cursor-pointer transition hover:brightness-[1.03]`
                    : "cursor-pointer rounded-full border border-dashed border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] bg-[color-mix(in_srgb,var(--dq-surface-muted)_50%,transparent)] px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--dq-muted)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_25%,var(--dq-border))] hover:text-[var(--dq-ink)] sm:text-[0.7rem]"
                }
              >
                <span className="font-display font-semibold normal-case tracking-normal">
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="reflection" className={labelClass}>
          Your thoughts
        </label>
        <textarea
          id="reflection"
          required
          rows={12}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write what you want to share…"
          className="dq-input min-h-[12rem] resize-y"
        />
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || busy || !canSubmit}
        className="rounded-full bg-[var(--dq-primary)] px-8 py-3.5 text-sm font-semibold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition duration-200 hover:brightness-110 disabled:opacity-50"
      >
        {busy ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
