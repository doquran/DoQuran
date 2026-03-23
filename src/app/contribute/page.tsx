import Link from "next/link";
import { redirect } from "next/navigation";
import { ContributeForm } from "@/components/ContributeForm";
import { ResendVerificationButton } from "@/components/ResendVerificationButton";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDailyVerse } from "@/lib/quran";

export const metadata = { title: "Contribute" };

export default async function ContributePage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login?next=/contribute");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  const daily = await getDailyVerse();

  return (
    <main className="relative mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-16">
      <div
        className="pointer-events-none absolute left-0 top-24 hidden h-48 w-px bg-gradient-to-b from-[color-mix(in_srgb,var(--dq-gold)_55%,transparent)] via-[color-mix(in_srgb,var(--dq-primary)_25%,transparent)] to-transparent lg:block"
        aria-hidden
      />
      <div className="mb-10 max-w-2xl text-center sm:text-left">
        <div className="dq-ornament mb-5 w-full justify-center sm:justify-start">
          <span className="dq-ornament__line max-w-[2.5rem] sm:max-w-[3rem]" aria-hidden />
          <span className="dq-ornament__dot" aria-hidden />
          <span
            className="dq-ornament__line dq-ornament__line--r max-w-[2.5rem] sm:max-w-[3rem]"
            aria-hidden
          />
        </div>
        <blockquote className="mb-6 text-center sm:text-left" dir="rtl">
          <p className="font-quran text-xl leading-[1.9] text-[var(--dq-ink)] sm:text-2xl">
            كِتَـٰبٌ أَنزَلْنَـٰهُ إِلَيْكَ مُبَـٰرَكٌ لِّيَدَّبَّرُوٓا۟ ءَايَـٰتِهِۦ
          </p>
          <p className="font-display mt-2 text-sm font-medium italic text-[var(--dq-muted)]" dir="ltr">
            &ldquo;A blessed Book We have revealed to you, that they might reflect upon its verses.&rdquo;
            <span className="ml-1 not-italic text-[var(--dq-gold-muted)]">
              — 38:29
            </span>
          </p>
        </blockquote>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-[2.35rem]">
          New contribution
        </h1>
        <p className="font-outfit mt-4 text-[var(--dq-muted)] leading-relaxed">
          Pick verses, add optional{" "}
          <strong className="font-semibold text-[var(--dq-ink)]">
            perspective seals
          </strong>{" "}
          (scientist, engineer, physician, educator, scholar…), then write your
          reflection. The community votes to recognize helpful voices—not cash,
          but reputation and reach.
        </p>
      </div>
      {daily ? (
        <div className="mb-8 rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-gold)_22%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_4%,var(--dq-surface))] px-5 py-4 text-sm leading-relaxed text-[var(--dq-muted)] shadow-[var(--dq-shadow-sm)] sm:px-6">
          Today&apos;s highlighted āyah is{" "}
          <Link
            href="/"
            className="font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-border)] underline-offset-2 hover:decoration-[var(--dq-primary)]"
          >
            {daily.surahNumber}:{daily.ayahInSurah}
          </Link>
          . You can reference it below or any other āyāt.
        </div>
      ) : null}
      {user && !user.emailVerified ? (
        <div className="dq-card mb-8 border-amber-200/80 bg-amber-50/90 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
          <p className="font-outfit text-sm font-semibold">
            Please verify your email before contributing.
          </p>
          <p className="mt-1.5 text-sm opacity-90">
            Check your inbox for a verification link, or request a new one below.
          </p>
          <div className="mt-4">
            <ResendVerificationButton />
          </div>
        </div>
      ) : null}
      <ContributeForm disabled={!user?.emailVerified} />
    </main>
  );
}
