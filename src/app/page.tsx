import type { ReactNode } from "react";
import Link from "next/link";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";
import { RecognitionSteps } from "@/components/home/RecognitionSteps";
import { StatsStrip } from "@/components/home/StatsStrip";
import { TalentPillars } from "@/components/home/TalentPillars";
import { SubmissionPreview, type Preview } from "@/components/SubmissionPreview";
import { prisma } from "@/lib/prisma";
import { getDailyVerse } from "@/lib/quran";
import { scoreFromVotes } from "@/lib/submission-score";
import { badgeChipsFromSubmission } from "@/lib/badges";

export const revalidate = 3600;

type SubmissionCard = {
  id: string;
  reflection: string;
  user: { id: string; email: string; name: string | null; avatarSeed: string };
  verses: { surah: number; ayah: number }[];
  votes: { value: number }[];
  submissionBadges: {
    badge: {
      slug: string;
      label: string;
      tagline: string;
      variant: string;
      sortOrder: number;
    };
  }[];
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 text-center sm:mb-10">
      <div className="dq-ornament mb-4 justify-center">
        <span className="dq-ornament__line max-w-[3.5rem] sm:max-w-[5rem]" aria-hidden />
        <span className="dq-ornament__dot" aria-hidden />
        <span
          className="dq-ornament__line dq-ornament__line--r max-w-[3.5rem] sm:max-w-[5rem]"
          aria-hidden
        />
      </div>
      <h2 className="font-display text-xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-2xl">
        {children}
      </h2>
    </div>
  );
}

type SortMode = "recent" | "top" | "trending";

type HomeProps = {
  searchParams: Promise<{ seal?: string; sort?: string }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const sealFilter = params.seal;
  const sortMode: SortMode =
    params.sort === "top" || params.sort === "trending"
      ? params.sort
      : "recent";
  const daily = await getDailyVerse();

  const [userCount, submissionCount, voteCount, forDaily, recent] =
    await Promise.all([
      prisma.user.count(),
      prisma.submission.count(),
      prisma.vote.count(),
      daily
        ? prisma.submission.findMany({
            where: {
              verses: {
                some: {
                  surah: daily.surahNumber,
                  ayah: daily.ayahInSurah,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 12,
            include: {
              user: { select: { id: true, email: true, name: true, avatarSeed: true } },
              verses: true,
              votes: { select: { value: true } },
              submissionBadges: { include: { badge: true } },
            },
          })
        : Promise.resolve([]),
      (async () => {
        const sealWhere = sealFilter
          ? { submissionBadges: { some: { badge: { slug: sealFilter } } } }
          : {};
        const sevenDaysAgo = new Date(new Date().getTime() - 7 * 86_400_000);
        const where =
          sortMode === "trending"
            ? { ...sealWhere, createdAt: { gte: sevenDaysAgo } }
            : sealWhere;

        const subs = await prisma.submission.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: sortMode === "recent" ? 8 : 50,
          include: {
            user: { select: { id: true, email: true, name: true, avatarSeed: true } },
            verses: true,
            votes: { select: { value: true } },
            submissionBadges: { include: { badge: true } },
          },
        });

        if (sortMode === "top" || sortMode === "trending") {
          subs.sort(
            (a, b) => scoreFromVotes(b.votes) - scoreFromVotes(a.votes),
          );
          return subs.slice(0, 12);
        }
        return subs;
      })(),
    ]);

  const mapPreview = (s: SubmissionCard): Preview => ({
    id: s.id,
    verses: s.verses.map((v) => ({ surah: v.surah, ayah: v.ayah })),
    reflection: s.reflection,
    authorDisplay: s.user.name?.trim() || s.user.email.split("@")[0],
    authorId: s.user.id,
    authorAvatarSeed: s.user.avatarSeed,
    score: scoreFromVotes(s.votes),
    badges: badgeChipsFromSubmission(s.submissionBadges),
  });

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
      <section className="dq-hero-entry mb-14 text-center sm:mb-16">
        <div className="dq-ornament mb-8 justify-center">
          <span className="dq-ornament__line max-w-[4.5rem]" aria-hidden />
          <span className="dq-ornament__dot" aria-hidden />
          <span className="dq-ornament__line dq-ornament__line--r max-w-[4.5rem]" aria-hidden />
        </div>
        <blockquote className="mb-8" dir="rtl">
          <p className="font-quran text-[clamp(1.5rem,4vw,2.2rem)] leading-[2] text-[var(--dq-ink)]">
            أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَآ
          </p>
          <p className="font-display mt-2 text-base font-medium italic tracking-wide text-[var(--dq-muted)]" dir="ltr">
            &ldquo;Then do they not reflect upon the Qur&apos;an, or are there locks upon [their] hearts?&rdquo;
            <span className="ml-1 not-italic text-[var(--dq-gold-muted)]">
              — 47:24, Sahih International
            </span>
          </p>
        </blockquote>
        <h1 className="font-display text-balance text-[clamp(2.1rem,5.5vw,3.35rem)] font-semibold leading-[1.12] tracking-wide text-[var(--dq-ink)]">
          Where the Qur&apos;an meets{" "}
          <span className="dq-gradient-word">modern expertise</span>
        </h1>
        <p className="font-outfit mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.8] text-[var(--dq-muted)] sm:text-lg">
          One āyah a day—Arabic and English—then{" "}
          <strong className="font-semibold text-[var(--dq-ink)]">
            your reflection
          </strong>
          : your personal reading of the verse through the lens of your life, your
          work, your field. Not a fatwa, not a lecture—your honest engagement.
          Tag it by perspective, and the community votes. The best thinking
          rises.
        </p>
        <div className="font-outfit mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-7 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            Join free
          </Link>
          <Link
            href="/contribute"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--dq-primary)_38%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_7%,var(--dq-surface))] px-7 py-3 text-sm font-bold tracking-wide text-[var(--dq-primary)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[color-mix(in_srgb,var(--dq-primary)_12%,var(--dq-surface))]"
          >
            Write a reflection
          </Link>
          <Link
            href="/why-reflect"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-dashed border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] bg-transparent px-6 py-3 text-sm font-bold tracking-wide text-[var(--dq-muted)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_28%,var(--dq-border))] hover:text-[var(--dq-ink)]"
          >
            Why reflect?
          </Link>
        </div>
      </section>

      <StatsStrip
        users={userCount}
        submissions={submissionCount}
        votes={voteCount}
      />

      <TalentPillars />

      {/* Who reflects here? */}
      <section className="mb-16 sm:mb-20">
        <SectionTitle>Who reflects here?</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🔬",
              role: "Data Scientist",
              example:
                "\u201cI see information theory in this verse\u2014the precision of encoding in DNA mirrors the precision of divine speech.\u201d",
            },
            {
              icon: "🩺",
              role: "Physician",
              example:
                "\u201cThis verse about creation connects to what I observe in embryology\u2014stages described centuries before microscopy.\u201d",
            },
            {
              icon: "⚙️",
              role: "Engineer",
              example:
                "\u201cThe structural language in this verse reminds me of load-bearing design\u2014nothing superfluous, every word carries weight.\u201d",
            },
          ].map((card) => (
            <div
              key={card.role}
              className="dq-card flex flex-col p-6 text-center"
            >
              <span className="text-3xl" aria-hidden>
                {card.icon}
              </span>
              <p className="font-outfit mt-3 text-sm font-bold tracking-wide text-[var(--dq-ink)]">
                {card.role}
              </p>
              <p className="font-display mt-3 flex-1 text-sm italic leading-[1.7] text-[var(--dq-muted)]">
                {card.example}
              </p>
            </div>
          ))}
        </div>
        <p className="font-outfit mt-6 text-center text-sm text-[var(--dq-muted)]">
          Classical scholars, seekers, educators, and anyone who reads with
          honest curiosity are equally welcome.
        </p>
      </section>

      {daily ? (
        <section className="dq-card relative mb-16 overflow-hidden sm:mb-20">
          <div
            className="pointer-events-none absolute inset-y-3 left-0 w-px bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--dq-gold)_70%,transparent)] to-transparent sm:left-1"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-3 right-0 w-px bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--dq-gold)_70%,transparent)] to-transparent sm:right-1"
            aria-hidden
          />
          <div className="relative px-6 py-8 sm:px-12 sm:py-10">
            <p className="font-outfit mb-4 text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--dq-gold-muted)] sm:text-left">
              Living text
            </p>
            <div className="mb-6 flex flex-col items-center gap-3 border-b border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] pb-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <span className="font-display text-lg font-medium text-[var(--dq-ink)] sm:text-xl">
                Surah {daily.surahNumber}
                <span className="mx-2 font-sans text-[var(--dq-muted)]">·</span>
                {daily.surahName}
                <span className="mx-2 font-sans text-[var(--dq-muted)]">·</span>
                <span className="text-[var(--dq-muted)]">Āyah</span>{" "}
                {daily.ayahInSurah}
              </span>
              <span className="rounded-md border border-[var(--dq-border)] bg-[var(--dq-surface-muted)] px-3 py-1 font-mono text-xs tracking-wide text-[var(--dq-muted)]">
                #{daily.globalNumber}
              </span>
            </div>
            <div className="rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_80%,var(--dq-gold)_20%)] bg-[color-mix(in_srgb,var(--dq-primary)_5%,var(--dq-surface-muted))] px-5 py-6 text-center sm:px-8 sm:py-8">
              <p className="font-quran text-[var(--dq-ink)]">{daily.arabic}</p>
            </div>
            <div className="mx-auto mt-8 max-w-3xl border-t border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] pt-8 text-center">
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--dq-gold-muted)]">
                English
                <span className="font-sans font-normal normal-case tracking-normal text-[var(--dq-muted)]">
                  {" "}
                  — Sahih International
                </span>
              </p>
              <p className="font-display text-lg font-medium leading-[1.7] text-[var(--dq-ink)] sm:text-xl">
                {daily.english}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contribute"
                className="font-outfit inline-flex min-w-[12rem] items-center justify-center rounded-full bg-[var(--dq-primary)] px-8 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                Contribute for this verse
              </Link>
              <Link
                href="/contribute"
                className="font-outfit inline-flex min-w-[12rem] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-8 py-3 text-sm font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_22%,var(--dq-border))] hover:bg-[var(--dq-surface-muted)]"
              >
                Other verses
              </Link>
              <a
                href={`https://quran.com/${daily.surahNumber}:${daily.ayahInSurah}/tafsirs`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-outfit inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--dq-muted)] underline decoration-[var(--dq-border)] underline-offset-[3px] transition hover:text-[var(--dq-primary)] hover:decoration-[var(--dq-gold)]"
              >
                Classical tafsir on Quran.com ↗
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="dq-card mb-16 border-amber-200/80 bg-amber-50/90 p-8 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100 sm:mb-20">
          <p className="font-display text-lg font-medium">
            Could not load today&apos;s verse.
          </p>
          <p className="mt-2 text-sm opacity-90">
            Check your connection; the Quran API may be unreachable.
          </p>
        </section>
      )}

      {daily && forDaily.length > 0 ? (
        <section className="mb-16 sm:mb-20">
          <SectionTitle>Community contributions for today&apos;s āyah</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            {forDaily.map((s) => (
              <SubmissionPreview key={s.id} s={mapPreview(s)} />
            ))}
          </div>
        </section>
      ) : daily ? (
        <section className="dq-card mb-16 border-dashed border-[color-mix(in_srgb,var(--dq-gold)_25%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-surface)_94%,var(--dq-surface-muted))] p-12 text-center sm:mb-20">
          <p className="font-outfit text-[var(--dq-muted)]">
            No community posts for this āyah yet.
          </p>
          <Link
            href="/contribute"
            className="font-outfit mt-5 inline-flex font-display text-base font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-gold)] decoration-1 underline-offset-[6px] transition hover:decoration-[var(--dq-primary)]"
          >
            Be the first to contribute
          </Link>
        </section>
      ) : null}

      <RecognitionSteps />

      <HomeCtaBand />

      <section id="recent" className="scroll-mt-24">
        <SectionTitle>
          {sealFilter
            ? `Reflections — ${sealFilter.charAt(0).toUpperCase()}${sealFilter.slice(1)}`
            : sortMode === "top"
              ? "Top contributions"
              : sortMode === "trending"
                ? "Trending this week"
                : "Recent contributions"}
        </SectionTitle>

        {/* Sort tabs + filter controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {(["recent", "top", "trending"] as const).map((mode) => {
            const label = mode === "recent" ? "Recent" : mode === "top" ? "Top" : "Trending";
            const isActive = sortMode === mode;
            const sealParam = sealFilter ? `&seal=${sealFilter}` : "";
            return (
              <Link
                key={mode}
                href={`/?sort=${mode}${sealParam}#recent`}
                className={`font-outfit rounded-full px-4 py-2 text-xs font-bold tracking-wide transition ${
                  isActive
                    ? "bg-[var(--dq-primary)] text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-sm)]"
                    : "border border-[var(--dq-border)] bg-[var(--dq-surface)] text-[var(--dq-muted)] hover:border-[color-mix(in_srgb,var(--dq-primary)_25%,var(--dq-border))] hover:text-[var(--dq-ink)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {sealFilter ? (
            <Link
              href={`/?sort=${sortMode}#recent`}
              className="font-outfit inline-flex items-center gap-1.5 rounded-full border border-dashed border-[color-mix(in_srgb,var(--dq-primary)_35%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_6%,var(--dq-surface))] px-4 py-2 text-xs font-bold tracking-wide text-[var(--dq-primary)] transition hover:bg-[color-mix(in_srgb,var(--dq-primary)_12%,var(--dq-surface))]"
            >
              <span aria-hidden>✕</span> {sealFilter}
            </Link>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <p className="font-outfit text-center text-[var(--dq-muted)]">
            {sealFilter
              ? "No reflections with this seal yet."
              : "Nothing published yet — register and share a thought."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {recent.map((s) => (
              <SubmissionPreview key={s.id} s={mapPreview(s)} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
