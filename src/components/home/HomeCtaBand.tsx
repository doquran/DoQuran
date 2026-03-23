import Link from "next/link";

export function HomeCtaBand() {
  return (
    <section
      className="dq-animate-in relative mb-16 overflow-hidden rounded-[var(--dq-radius-lg)] border-2 border-[color-mix(in_srgb,var(--dq-gold)_45%,var(--dq-border))] bg-gradient-to-br from-[color-mix(in_srgb,var(--dq-primary)_8%,var(--dq-surface))] via-[var(--dq-surface)] to-[color-mix(in_srgb,var(--dq-gold)_10%,var(--dq-surface-muted))] p-8 shadow-[var(--dq-shadow-lg)] sm:mb-20 sm:p-12"
      aria-labelledby="cta-band-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--dq-gold)_18%,transparent)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--dq-primary)_12%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative text-center">
        <p className="font-outfit mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--dq-gold-muted)]">
          Open invitation
        </p>
        <h2
          id="cta-band-heading"
          className="font-display mx-auto max-w-2xl text-balance text-2xl font-semibold leading-snug tracking-wide text-[var(--dq-ink)] sm:text-3xl"
        >
          If you&apos;ve ever wished the conversation around Quranic meaning felt
          as rigorous as your field—this is your room.
        </h2>
        <p className="font-outfit mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--dq-muted)] sm:text-base">
          No audition. Bring adab, cite humility, and let the votes do the
          curating.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="font-outfit inline-flex items-center justify-center rounded-full bg-[var(--dq-primary)] px-7 py-3.5 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_28%,transparent)] transition hover:brightness-110"
          >
            Join free
          </Link>
          <Link
            href="/login"
            className="font-outfit inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--dq-border)_80%,var(--dq-gold)_20%)] bg-[var(--dq-surface)] px-7 py-3.5 text-sm font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-surface-muted)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
