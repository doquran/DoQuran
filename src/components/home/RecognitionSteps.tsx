import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Choose verses",
    text: "Pick the āyāt you are actually thinking about—one or a short range.",
  },
  {
    n: "02",
    title: "Seal your lens",
    text: "Add scientist, engineer, physician, educator, scholar—so readers know how to read you.",
  },
  {
    n: "03",
    title: "Earn recognition",
    text: "The crowd votes. Strong, generous writing rises—no paywall, no clout algorithm.",
  },
];

export function RecognitionSteps() {
  return (
    <section className="relative mb-16 sm:mb-24">
      <div className="dq-ornament mb-6 justify-center">
        <span className="dq-ornament__line max-w-[3rem] sm:max-w-[4rem]" aria-hidden />
        <span className="dq-ornament__dot" aria-hidden />
        <span
          className="dq-ornament__line dq-ornament__line--r max-w-[3rem] sm:max-w-[4rem]"
          aria-hidden
        />
      </div>
      <h2 className="font-display mb-3 text-center text-2xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-3xl">
        Recognition, not noise
      </h2>
      <p className="font-outfit mx-auto mb-10 max-w-2xl text-center text-sm text-[var(--dq-muted)] sm:text-base">
        Upvotes and downvotes are the reward loop: they surface writing that
        helps people understand, feel, or act. It&apos;s simple on purpose—so
        quality and adab can compete on merit.
      </p>
      <ol className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3 sm:gap-4">
        {steps.map((s, i) => (
          <li
            key={s.n}
            className="relative rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] p-6 text-center shadow-[var(--dq-shadow-md)] sm:text-left"
          >
            {i < steps.length - 1 ? (
              <span
                className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-[var(--dq-gold)] to-transparent opacity-60 sm:block"
                aria-hidden
              />
            ) : null}
            <span className="font-outfit mb-3 inline-block rounded-full border border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-gold)_12%,var(--dq-surface-muted))] px-3 py-1 text-[0.65rem] font-bold tabular-nums tracking-[0.2em] text-[var(--dq-gold-muted)]">
              {s.n}
            </span>
            <h3 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
              {s.title}
            </h3>
            <p className="font-outfit mt-2 text-sm leading-relaxed text-[var(--dq-muted)]">
              {s.text}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/register"
          className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-8 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110"
        >
          Claim your seat at the table
        </Link>
        <Link
          href="/contribute"
          className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--dq-primary)_35%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_6%,var(--dq-surface))] px-8 py-3 text-sm font-bold tracking-wide text-[var(--dq-primary)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[color-mix(in_srgb,var(--dq-primary)_11%,var(--dq-surface))]"
        >
          Start a reflection
        </Link>
      </div>
    </section>
  );
}
