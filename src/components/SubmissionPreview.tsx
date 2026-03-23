import Link from "next/link";
import { PerspectiveBadges } from "@/components/PerspectiveBadges";
import type { BadgeChip } from "@/lib/badges";

export type Preview = {
  id: string;
  verses: { surah: number; ayah: number }[];
  reflection: string;
  authorDisplay: string;
  authorId?: string;
  authorAvatarSeed?: string;
  score: number;
  badges?: BadgeChip[];
};

function verseLabel(v: { surah: number; ayah: number }) {
  return `${v.surah}:${v.ayah}`;
}

function diceBearUrl(seed: string, size = 40): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&size=${size}&backgroundColor=transparent`;
}

export function SubmissionPreview({ s }: { s: Preview }) {
  const refs = s.verses.map(verseLabel).join(", ");
  const snippet =
    s.reflection.length > 220
      ? `${s.reflection.slice(0, 220)}…`
      : s.reflection;

  const scoreLabel = s.score > 0 ? `+${s.score}` : String(s.score);

  const authorContent = (
    <span className="inline-flex items-center gap-1.5 tracking-wide text-[var(--dq-muted)]">
      {s.authorAvatarSeed ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={diceBearUrl(s.authorAvatarSeed)}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 rounded-full border border-[var(--dq-border)] bg-[var(--dq-surface-muted)]"
        />
      ) : null}
      {s.authorDisplay}
    </span>
  );

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
            {s.authorId ? (
              <Link
                href={`/profile/${s.authorId}`}
                className="transition hover:text-[var(--dq-primary)]"
              >
                {authorContent}
              </Link>
            ) : (
              authorContent
            )}
          </div>
          <span
            className="rounded-full border border-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-gold)_10%,var(--dq-surface))] px-3 py-0.5 text-xs font-bold tabular-nums tracking-wide text-[var(--dq-primary)]"
            title="Score"
          >
            {scoreLabel}
          </span>
        </div>
        {s.badges && s.badges.length > 0 ? (
          <PerspectiveBadges badges={s.badges} className="mb-3" />
        ) : null}
        <p className="flex-1 text-sm leading-[1.7] text-[var(--dq-ink)]/95">
          {snippet}
        </p>
        <Link
          href={`/submissions/${s.id}`}
          className="font-outfit mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[color-mix(in_srgb,var(--dq-primary)_35%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_8%,var(--dq-surface))] px-4 py-2 text-sm font-bold tracking-wide text-[var(--dq-primary)] shadow-[var(--dq-shadow-sm)] transition group-hover:border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] group-hover:bg-[color-mix(in_srgb,var(--dq-primary)_12%,var(--dq-surface))]"
        >
          Open
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
