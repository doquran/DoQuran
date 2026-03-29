import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "DoQuran is a community platform where modern professionals engage with the Qur'an through daily reflections, perspective seals, and peer recognition.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-16">
      <div className="dq-ornament mb-8 justify-center">
        <span className="dq-ornament__line max-w-[3rem]" aria-hidden />
        <span className="dq-ornament__dot" aria-hidden />
        <span
          className="dq-ornament__line dq-ornament__line--r max-w-[3rem]"
          aria-hidden
        />
      </div>

      <h1 className="font-display text-center text-3xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-4xl">
        About DoQuran
      </h1>

      <div className="font-outfit mx-auto mt-10 max-w-2xl space-y-6 text-base leading-[1.85] text-[var(--dq-ink)]">
        <p>
          DoQuran is built on a simple belief: the Qur&apos;an speaks to every
          generation, and every discipline has something valuable to hear in it.
        </p>

        <p>
          Each day, the platform presents one verse — Arabic text and English
          translation — and invites contributors to share a brief reflection
          through the lens of their expertise: science, engineering, medicine,
          education, classical scholarship, or personal seeking.
        </p>

        <p>
          Contributors tag their reflections with{" "}
          <strong className="font-semibold">perspective seals</strong> that
          signal the angle they&apos;re writing from. The community votes on
          which readings are most helpful, and over time, contributors earn
          recognition through tiered levels — from{" "}
          <em>Newcomer</em> to <em>Pillar</em> — and per-seal ranks like{" "}
          <em>Rising Scientist</em> or <em>Distinguished Scholar</em>.
        </p>

        <h2 className="font-display !mt-10 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          What this is not
        </h2>

        <p>
          DoQuran is not a tafsir platform, not a fatwa service, and not a
          replacement for scholarly authority. It is a gathering place for
          thoughtful people who want to engage with the Qur&apos;an without
          leaving their intellect at the door — and who believe that a
          cardiologist&apos;s reading of a verse about the heart, or an
          engineer&apos;s reading of a verse about structure, can complement
          (not replace) the classical tradition.
        </p>

        <h2 className="font-display !mt-10 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Principles
        </h2>

        <ul className="list-inside list-disc space-y-2 text-[var(--dq-ink)]/90">
          <li>
            <strong className="font-semibold">Qur&apos;an first</strong> — the
            text is always the anchor; community content is secondary.
          </li>
          <li>
            <strong className="font-semibold">No paywall on meaning</strong> —
            all verses and reflections are freely accessible.
          </li>
          <li>
            <strong className="font-semibold">Merit, not algorithm</strong> —
            votes determine visibility, not engagement hacks.
          </li>
          <li>
            <strong className="font-semibold">Respect and safety</strong> —
            every post can be reported, and a human reviews flagged content.
          </li>
        </ul>

        <h2 className="font-display !mt-10 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          How it started
        </h2>

        <p>
          DoQuran began with a simple personal need: a place to write down my
          understanding of each verse of the Qur&apos;an — and have it persist,
          be accessible, and be mine. Not scattered across notebooks or buried in
          chat threads, but structured, searchable, and always there when I
          needed it.
        </p>

        <p>
          Then I realised that if I wanted this, others must too. And if those
          others happened to be physicians, engineers, data scientists, and
          teachers, their reflections — viewed through the lens of their
          expertise — would not only be valuable for them, but for anyone reading
          the same verse. That is how a personal journal became a community
          platform.
        </p>

        <h2 className="font-display !mt-10 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Open source
        </h2>

        <p>
          DoQuran is fully open source under the MIT License. The Qur&apos;an is
          freely available to all humanity; a platform built around it should be
          open in the same spirit. Developers, designers, and contributors are
          welcome — see our{" "}
          <a
            href="https://github.com/doquran/DoQuran"
            className="font-medium text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
          >
            GitHub repository
          </a>
          .
        </p>

        <h2 className="font-display !mt-10 text-xl font-semibold tracking-wide text-[var(--dq-ink)]">
          Attribution
        </h2>

        <p className="text-sm leading-relaxed text-[var(--dq-muted)]">
          Quranic Arabic text and English translation (Sahih International) are
          sourced from the{" "}
          <a
            href="https://alquran.cloud/api"
            className="font-medium text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
          >
            Al Quran Cloud API
          </a>
          . All community reflections are user-submitted and represent the views
          of their authors.
        </p>
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/register"
          className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-8 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98]"
        >
          Join the community
        </Link>
      </div>
    </main>
  );
}
