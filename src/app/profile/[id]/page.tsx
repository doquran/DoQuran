import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { SubmissionPreview, type Preview } from "@/components/SubmissionPreview";
import { badgeChipsFromSubmission } from "@/lib/badges";
import {
  overallTier,
  overallTierLabel,
  overallTierProgress,
  overallPointsToNext,
  sealTier,
  sealTierLabel,
  sealTierProgress,
  sealPointsToNext,
  sealTierQualified,
  type SealTier,
} from "@/lib/levels";
import { prisma } from "@/lib/prisma";
import { scoreFromVotes } from "@/lib/submission-score";

type PageProps = { params: Promise<{ id: string }> };

function diceBearUrl(seed: string, size = 128): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&size=${size}&backgroundColor=transparent`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { displayName: true, name: true, email: true, sealProgress: true },
  });
  if (!user) return { title: "Profile not found" };

  const displayName =
    user.displayName?.trim() || user.name?.trim() || user.email.split("@")[0];
  const totalScore = user.sealProgress.reduce((s, p) => s + p.score, 0);
  const tier = overallTier(totalScore);

  return {
    title: `${displayName} — ${overallTierLabel(tier)}`,
    description: `${displayName} is a ${overallTierLabel(tier)} on DoQuran with ${totalScore} total upvotes. View their reflections, perspective seals, and community standing.`,
    openGraph: {
      title: `${displayName} — ${overallTierLabel(tier)} on DoQuran`,
      description: `${totalScore} upvotes across Quranic reflections. See their perspective seals and contributions.`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${displayName} on DoQuran`,
      description: `${overallTierLabel(tier)} · ${totalScore} upvotes`,
    },
  };
}

const SEAL_VARIANT_COLOR: Record<string, string> = {
  sapphire: "var(--dq-seal-sapphire, #0e7490)",
  copper: "var(--dq-accent)",
  healer: "#15803d",
  aurum: "var(--dq-gold)",
  sage: "var(--dq-primary)",
  ink: "var(--dq-ink)",
};

function SealProgressBar({
  sealLabel,
  variant,
  score,
  tier,
}: {
  sealLabel: string;
  variant: string;
  score: number;
  tier: SealTier;
}) {
  const progress = sealTierProgress(score);
  const remaining = sealPointsToNext(score);
  const color = SEAL_VARIANT_COLOR[variant] ?? "var(--dq-primary)";
  const qualified = sealTierQualified(tier, sealLabel);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-outfit font-semibold tracking-wide text-[var(--dq-ink)]">
          {qualified}
        </span>
        <span className="font-outfit text-xs font-medium tabular-nums text-[var(--dq-muted)]">
          {score} pts{remaining > 0 ? ` · ${remaining} to next` : " · Max"}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--dq-surface-muted)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(2, progress * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--dq-muted)]">
        {sealTierLabel(tier)}
      </p>
    </div>
  );
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      name: true,
      email: true,
      avatarSeed: true,
      bio: true,
      currentStreak: true,
      longestStreak: true,
      createdAt: true,
      sealProgress: true,
    },
  });

  if (!user) notFound();

  const displayName =
    user.displayName?.trim() || user.name?.trim() || user.email.split("@")[0];

  const totalScore = user.sealProgress.reduce((s, p) => s + p.score, 0);
  const tier = overallTier(totalScore);
  const progress = overallTierProgress(totalScore);
  const toNext = overallPointsToNext(totalScore);

  const badges = await prisma.badge.findMany({ orderBy: { sortOrder: "asc" } });
  const badgeMap = new Map(badges.map((b) => [b.slug, b]));

  const sealRows = user.sealProgress
    .filter((sp) => sp.score > 0 || sp.level > 0)
    .sort((a, b) => {
      const ba = badgeMap.get(a.sealSlug);
      const bb = badgeMap.get(b.sealSlug);
      return (ba?.sortOrder ?? 99) - (bb?.sortOrder ?? 99);
    });

  const recentSubmissions = await prisma.submission.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { id: true, email: true, name: true, avatarSeed: true } },
      verses: true,
      votes: { select: { value: true } },
      submissionBadges: { include: { badge: true } },
    },
  });

  const previews: Preview[] = recentSubmissions.map((s) => ({
    id: s.id,
    verses: s.verses.map((v) => ({ surah: v.surah, ayah: v.ayah })),
    reflection: s.reflection,
    authorDisplay: displayName,
    authorId: s.user.id,
    authorAvatarSeed: s.user.avatarSeed,
    score: scoreFromVotes(s.votes),
    badges: badgeChipsFromSubmission(s.submissionBadges),
  }));

  const profileUrl =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${id}`
      : `/profile/${id}`;

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-4 py-2 text-sm font-medium tracking-wide text-[var(--dq-muted)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_22%,var(--dq-border))] hover:text-[var(--dq-primary)]"
      >
        <span aria-hidden>←</span> Back to home
      </Link>

      {/* --- Identity card --- */}
      <section className="dq-card relative mb-12 overflow-hidden p-8 sm:p-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--dq-gold)_65%,transparent)] to-transparent"
          aria-hidden
        />
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={diceBearUrl(user.avatarSeed, 128)}
            alt=""
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-full border-2 border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] bg-[var(--dq-surface-muted)] shadow-[var(--dq-shadow-md)]"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-3xl">
              {displayName}
            </h1>
            {user.bio ? (
              <p className="font-outfit mt-2 max-w-xl text-sm leading-relaxed text-[var(--dq-muted)]">
                {user.bio}
              </p>
            ) : null}
            <div className="font-outfit mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--dq-gold)_45%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-gold)_12%,var(--dq-surface))] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--dq-gold-muted)] shadow-[var(--dq-shadow-sm)]">
                {overallTierLabel(tier)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-[var(--dq-ink)]">
                {totalScore} upvotes
              </span>
              <span className="text-xs text-[var(--dq-muted)]">
                Joined{" "}
                {user.createdAt.toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-8 border-t border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-outfit font-semibold text-[var(--dq-ink)]">
              Overall level
            </span>
            <span className="font-outfit text-xs font-medium tabular-nums text-[var(--dq-muted)]">
              {toNext > 0 ? `${toNext} pts to ${overallTierLabel((tier + 1) as 0 | 1 | 2 | 3 | 4)}` : "Max level"}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--dq-surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--dq-gold)] transition-all duration-500"
              style={{ width: `${Math.max(2, progress * 100)}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] pt-6 sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🔥
            </span>
            <div>
              <p className="font-outfit text-lg font-bold tabular-nums text-[var(--dq-ink)]">
                {user.currentStreak}
              </p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-muted)]">
                Current streak
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              ⚡
            </span>
            <div>
              <p className="font-outfit text-lg font-bold tabular-nums text-[var(--dq-ink)]">
                {user.longestStreak}
              </p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--dq-muted)]">
                Longest streak
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <ShareProfileButton url={profileUrl} name={displayName} />
          </div>
        </div>
      </section>

      {/* --- Seal progress --- */}
      {sealRows.length > 0 ? (
        <section className="mb-12">
          <h2 className="font-display mb-6 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
            Perspective seal progress
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {sealRows.map((sp) => {
              const badge = badgeMap.get(sp.sealSlug);
              if (!badge) return null;
              return (
                <div key={sp.sealSlug} className="dq-card p-5">
                  <SealProgressBar
                    sealLabel={badge.label}
                    variant={badge.variant}
                    score={sp.score}
                    tier={sealTier(sp.score) as SealTier}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* --- Recent reflections --- */}
      <section>
        <h2 className="font-display mb-6 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Recent reflections
        </h2>
        {previews.length === 0 ? (
          <div className="dq-card border-dashed p-10 text-center">
            <p className="font-outfit text-sm text-[var(--dq-muted)]">
              No reflections yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {previews.map((p) => (
              <SubmissionPreview key={p.id} s={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
