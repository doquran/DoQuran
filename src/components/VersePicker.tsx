"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ayahCountForSurah } from "@/lib/verse-meta";
import { surahNameEn } from "@/lib/surah-names";

export type VerseRef = { surah: number; ayah: number };

/** Shared chevron for surah combobox and āyah select (theme stroke). */
function FieldChevron({
  open,
  className,
}: {
  open?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`h-[11px] w-[11px] shrink-0 text-[var(--dq-muted)] transition-transform duration-200 ease-out ${open ? "rotate-180" : ""} ${className ?? ""}`}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.5 4.25L6 7.75L9.5 4.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  verses: VerseRef[];
  onVersesChange: (next: VerseRef[]) => void;
  maxVerses: number;
};

export function VersePicker({ verses, onVersesChange, maxVerses }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const surahBtnRef = useRef<HTMLButtonElement>(null);
  const surahPanelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [surahOpen, setSurahOpen] = useState(false);
  const [surahFilter, setSurahFilter] = useState("");
  const [draftSurah, setDraftSurah] = useState(2);
  const [draftAyah, setDraftAyah] = useState(255);

  const maxDraftAyah = ayahCountForSurah(draftSurah);

  const filteredSurahNums = useMemo(() => {
    const q = surahFilter.trim().toLowerCase();
    const out: number[] = [];
    for (let n = 1; n <= 114; n++) {
      if (!q) {
        out.push(n);
        continue;
      }
      const name = surahNameEn(n).toLowerCase();
      if (String(n).startsWith(q) || name.includes(q)) out.push(n);
    }
    return out;
  }, [surahFilter]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (surahPanelRef.current?.contains(t)) return;
      if (surahBtnRef.current?.contains(t)) return;
      setSurahOpen(false);
    }
    if (!surahOpen) return;
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [surahOpen]);

  useEffect(() => {
    if (surahOpen) {
      searchRef.current?.focus();
    }
  }, [surahOpen]);

  useEffect(() => {
    if (!surahOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSurahOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [surahOpen]);

  const pickSurah = useCallback((n: number) => {
    setDraftSurah(n);
    setDraftAyah((a) => Math.min(a, ayahCountForSurah(n)));
    setSurahOpen(false);
    setSurahFilter("");
  }, []);

  const addVerse = useCallback(() => {
    if (verses.length >= maxVerses) return;
    const next = { surah: draftSurah, ayah: draftAyah };
    const key = `${next.surah}:${next.ayah}`;
    if (verses.some((v) => `${v.surah}:${v.ayah}` === key)) return;
    onVersesChange([...verses, next]);
  }, [verses, maxVerses, draftSurah, draftAyah, onVersesChange]);

  const removeVerse = useCallback(
    (i: number) => {
      onVersesChange(verses.filter((_, idx) => idx !== i));
    },
    [verses, onVersesChange]
  );

  const sortVerses = useCallback(() => {
    const sorted = [...verses].sort(
      (a, b) => a.surah - b.surah || a.ayah - b.ayah
    );
    onVersesChange(sorted);
  }, [verses, onVersesChange]);

  const atMax = verses.length >= maxVerses;

  return (
    <div ref={rootRef} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        <div className="relative">
          <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-gold-muted)]">
            Surah
          </label>
          <button
            ref={surahBtnRef}
            type="button"
            aria-expanded={surahOpen}
            aria-haspopup="listbox"
            onClick={() =>
              setSurahOpen((open) => {
                if (!open) setSurahFilter("");
                return !open;
              })
            }
            className="dq-input flex w-full items-center justify-between gap-2 pr-3 text-left text-sm font-medium text-[var(--dq-ink)]"
          >
            <span className="min-w-0 truncate">
              <span className="font-mono text-[var(--dq-muted)]">
                {draftSurah}.
              </span>{" "}
              {surahNameEn(draftSurah)}
            </span>
            <FieldChevron open={surahOpen} />
          </button>
          {surahOpen ? (
            <div
              ref={surahPanelRef}
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_82%,var(--dq-gold)_18%)] bg-[var(--dq-surface)] shadow-[var(--dq-shadow-lg)]"
              role="listbox"
            >
              <div className="border-b border-[var(--dq-border)] p-2">
                <input
                  ref={searchRef}
                  type="search"
                  value={surahFilter}
                  onChange={(e) => setSurahFilter(e.target.value)}
                  placeholder="Search number or name…"
                  className="dq-input py-2 text-sm"
                  aria-label="Search surah"
                />
              </div>
              <ul className="max-h-52 overflow-y-auto overscroll-contain py-1">
                {filteredSurahNums.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-[var(--dq-muted)]">
                    No match.
                  </li>
                ) : (
                  filteredSurahNums.map((n) => (
                    <li key={n} role="option" aria-selected={n === draftSurah}>
                      <button
                        type="button"
                        onClick={() => pickSurah(n)}
                        className="flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm transition hover:bg-[var(--dq-muted-bg)]"
                      >
                        <span className="w-7 shrink-0 font-mono text-xs text-[var(--dq-muted)]">
                          {n}
                        </span>
                        <span className="font-medium text-[var(--dq-ink)]">
                          {surahNameEn(n)}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="draft-ayah"
            className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-gold-muted)]"
          >
            Āyah
          </label>
          <div className="relative">
            <select
              id="draft-ayah"
              value={draftAyah}
              onChange={(e) => setDraftAyah(Number(e.target.value))}
              className="dq-input w-full cursor-pointer appearance-none py-2.5 pl-4 pr-10 text-sm font-medium tabular-nums [&::-webkit-appearance]:appearance-none"
            >
              {Array.from({ length: maxDraftAyah }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              )}
            </select>
            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
              aria-hidden
            >
              <FieldChevron />
            </span>
          </div>
        </div>

        <div className="flex sm:pb-0.5">
          <button
            type="button"
            onClick={addVerse}
            disabled={atMax}
            className="dq-input w-full border-[color-mix(in_srgb,var(--dq-primary)_55%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_9%,var(--dq-surface))] py-2.5 text-sm font-semibold tracking-wide text-[var(--dq-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_22%,transparent)] transition hover:bg-[color-mix(in_srgb,var(--dq-primary)_14%,var(--dq-surface))] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[6rem] sm:px-4"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-[var(--dq-muted)]">
          {verses.length} / {maxVerses} verses · duplicates skipped
        </p>
        {verses.length > 1 ? (
          <button
            type="button"
            onClick={sortVerses}
            className="text-xs font-medium text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 hover:decoration-[var(--dq-primary)]"
          >
            Sort by surah &amp; āyah
          </button>
        ) : null}
      </div>

      {verses.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Selected verses">
          {verses.map((v, i) => (
            <li
              key={`${v.surah}-${v.ayah}-${i}`}
              className="inline-flex items-center gap-1 rounded-lg border border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] bg-[var(--dq-surface-muted)] pl-2.5 pr-1 py-1 text-sm shadow-[var(--dq-shadow-sm)]"
            >
              <span className="font-mono text-xs font-semibold text-[var(--dq-ink)]">
                {v.surah}:{v.ayah}
              </span>
              <span className="hidden max-w-[8rem] truncate text-xs text-[var(--dq-muted)] sm:inline">
                {surahNameEn(v.surah)}
              </span>
              <button
                type="button"
                onClick={() => removeVerse(i)}
                className="ml-0.5 flex h-7 w-7 items-center justify-center rounded-md text-[var(--dq-muted)] transition hover:bg-[var(--dq-muted-bg)] hover:text-[var(--dq-ink)]"
                aria-label={`Remove ${v.surah}:${v.ayah}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--dq-border)] bg-[var(--dq-surface-muted)]/40 px-3 py-3 text-center text-sm text-[var(--dq-muted)]">
          Choose a surah and āyah, then tap <strong>Add</strong>.
        </p>
      )}
    </div>
  );
}
