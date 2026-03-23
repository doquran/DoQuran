import Link from "next/link";

export type Preview = {
  id: string;
  verses: { surah: number; ayah: number }[];
  reflection: string;
  authorDisplay: string;
  score: number;
};

function verseLabel(v: { surah: number; ayah: number }) {
  return `${v.surah}:${v.ayah}`;
}

export function SubmissionPreview({ s }: { s: Preview }) {
  const refs = s.verses.map(verseLabel).join(", ");
  const snippet =
    s.reflection.length > 220
      ? `${s.reflection.slice(0, 220)}…`
      : s.reflection;

  const scoreLabel = s.score > 0 ? `+${s.score}` : String(s.score);

  return (
    <article className="group dq-card relative flex flex-col overflow-hidden pt-1 transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--dq-gold)_28%,var(--dq-border))] hover:shadow-[var(--dq-shadow-lg)]">
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--dq-gold)_55%,transparent)] to-transparent opacity-90"
        aria-hidden
      />
      <div className="flex flex-col p-6 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 gap-y-2 border-b border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] pb-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[color-mix(in_srgb,var(--dq-border)_90%,var(--dq-gold)_10%)] bg-[var(--dq-surface-muted)] px-2.5 py-1 font-mono text-[0.8125rem] font-semibold tracking-wide text-[var(--dq-ink)]">
              {refs}
            </span>
            <span className="text-[var(--dq-muted)]">·</span>
            <span className="tracking-wide text-[var(--dq-muted)]">
              {s.authorDisplay}
            </span>
          </div>
          <span
            className="rounded-full border border-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-gold)_10%,var(--dq-surface))] px-3 py-0.5 text-xs font-bold tabular-nums tracking-wide text-[var(--dq-primary)]"
            title="Score"
          >
            {scoreLabel}
          </span>
        </div>
        <p className="flex-1 text-sm leading-[1.7] text-[var(--dq-ink)]/95">
          {snippet}
        </p>
        <Link
          href={`/submissions/${s.id}`}
          className="mt-5 inline-flex items-center justify-center gap-1.5 self-start border-b border-transparent text-sm font-semibold tracking-wide text-[var(--dq-primary)] transition group-hover:border-[var(--dq-gold)] group-hover:gap-2"
        >
          Read full post
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
