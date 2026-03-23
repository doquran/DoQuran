import Link from "next/link";
import { redirect } from "next/navigation";
import { ContributeForm } from "@/components/ContributeForm";
import { getSessionUserId } from "@/lib/auth";
import { getDailyVerse } from "@/lib/quran";

export const metadata = { title: "Contribute" };

export default async function ContributePage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login?next=/contribute");
  }

  const daily = await getDailyVerse();

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-2xl text-center sm:text-left">
        <div className="dq-ornament mb-5 w-full justify-center sm:justify-start">
          <span className="dq-ornament__line max-w-[2.5rem] sm:max-w-[3rem]" aria-hidden />
          <span className="dq-ornament__dot" aria-hidden />
          <span
            className="dq-ornament__line dq-ornament__line--r max-w-[2.5rem] sm:max-w-[3rem]"
            aria-hidden
          />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-[2.15rem]">
          New contribution
        </h1>
        <p className="mt-3 text-[var(--dq-muted)] leading-relaxed">
          Pick verses, write your thoughts, others vote.
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
      <ContributeForm />
    </main>
  );
}
